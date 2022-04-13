const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');

const register = require('./controllers/register');
const image = require('./controllers/image');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const auth = require('./controllers/authorization');

const db = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI
});

const app = express();
// If I don't add this middleware, my requests won't be parsed as JSONs and I will have a headache and 7 years of bad luck.
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.status(200).json('heartbeat...') });
app.get('/profile/:id',auth.requireAuth, (req, res) => { profile.handleProfile(req, res, db) });
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) });
app.post('/signin', (req, res) => { signin.signInAuthentication(req, res, db, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.post('/imageUrl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) });
app.put('/imageCount', auth.requireAuth, (req, res) => image.handleImageCount(req, res, db));

app.listen(process.env.PORT || 3000);
