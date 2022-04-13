const jwt = require('jsonwebtoken');
const redis = require('redis');

// setup Redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignIn = (req, db, bcrypt) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return Promise.reject('Incorrect form submission');
    }

    return db.select('email', 'hash')
        .from('login')
        .where('email', '=', email)
        .then(data => {
            const matchingPassword = bcrypt.compareSync(password, data[0].hash);
            if (matchingPassword) {
                return db.select('*')
                    .from('users')
                    .where('email', '=', email)
                    .then(user => user[0])
                    .catch(() => Promise.reject('Unable to get user'));
            } else {
                Promise.reject('Incorrect credentials')
            }
        })
        .catch(() => Promise.reject('Incorrect credentials'));
}

const getAuthTokenId = (req, res) => {
    const { authorization } = req.headers;
    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(400).json('Unauthorized');
        }
        return res.json({ id: reply });
    })
}

const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
}

const setToken = (key, value) => {
    return Promise.resolve(redisClient.set(key, value));
}

const createSession = (user) => {
    // create JWT
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => {
            return {
                success: 'true',
                userId: id,
                token: token
            }
        })
        .catch(console.log);
}

const signInAuthentication = (req, res, db, bcrypt) => {
    const { authorization } = req.headers;

    return authorization ? getAuthTokenId(req, res)
        : handleSignIn(req, db, bcrypt)
            .then(data => {
                return data.id && data.email ? createSession(data) : Promise.reject('Unable to log in');
            })
            .then(session => res.json(session))
            .catch(err => res.status(400).json(err));
}

module.exports = {
    signInAuthentication,
    redisClient
};