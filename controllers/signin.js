const handleSignIn = (req, res, db, bcrypt) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    db.select('email', 'hash')
        .from('login')
        .where('email', '=', email)
        .then(data => {
            const matchingPassword = bcrypt.compareSync(password, data[0].hash);
            if (matchingPassword) {
                return db.select('*')
                    .from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(() => res.status(400).json('Unable to get user'));
            } else {
                res.status(400).json('Incorrect credentials')
            }
        })
        .catch(() => res.status(400).json('Incorrect credentials'));
}

module.exports = {
    handleSignIn
};