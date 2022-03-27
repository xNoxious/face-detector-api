# face-detector-api

Backend API for an app where you can register, sign in and submit image urls and have the human faces on the image detected by AI and drawn by bounding boxes.

Written in Node.js using PostgreSQL, bcrypt, knex.js and deployed on Heroku.

To run:

1. Clone the project
2. Install PostgreSQL if you don't have it already
3. Run scripts from controllers/database.mssql
4. Replace knex code from:
```
  const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    }
});
```

to:
  
```
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'YOUR_USER_HERE',
        password: 'YOUR_PASSWORD_HERE',
        database: 'face-detector'
    }
});
```

5. run <code>npm install</code>
6. Replace the **DATABASE_URL** across the solution with your local database url
7. Add your own key for **process.env.API_KEY_CLARIFAI** in the controllers/image.js component
8. run <code>npm start</code>
