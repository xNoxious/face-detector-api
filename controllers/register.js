const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    db.transaction(trx => { // transactional insert so user gets registered only if we successfully hashed their password.
        trx('login')
            .insert({
                hash: hash,
                email: email
            })
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .returning('*')
                    .then(user => {
                        res.json(user[0])
                    })
            })
            .then(trx.commit) // commit transaction otherwise no db update
            .catch(trx.rollback);
    })
        .catch(() => res.status(400).json('Unsuccessful registration'));
}

module.exports = {
    handleRegister
};