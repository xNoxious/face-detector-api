# face-detector-api

Backend API for an app where you can register, sign in and submit image urls and have the human faces on the image detected by AI and drawn by bounding boxes.

Written in Node.js using PostgreSQL, bcrypt, knex.js and deployed on Heroku.
Uses JWT for authorization, Redis for sessions, Docker & Docker Compose for containerization

To run:

1. Clone the project
2. Add your own key for **process.env.API_KEY_CLARIFAI** in docker-compose.yml
2. Run docker-compose up --build