const handleProfile = (req, res, db) => {
    const { id } = req.params;

    db.select('*')
        .from('users')
        .where({ id: id })
        .then(user => {
            if (user.length) {
                res.status(200).json(user[0]);
            } else {
                res.status(400).json('Error getting user');
            }
        });
}

const handleProfileUpdate = (req, res, db) => {
    const { id } = req.params;
    const { name, age, pet } = req.body.formInput;

    db('users')
        .where({ id: id })
        .update({ name, age, pet })
        .then(user => {
            if (user) {
                res.status(200).json("success")
            } else {
                res.status(400).json('Error updating user');
            }
        })
        .catch(err => res.status(400).json('Unable to update user'));
}

module.exports = {
    handleProfile,
    handleProfileUpdate
};