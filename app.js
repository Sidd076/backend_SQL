const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your database username
  password: '123456', // Replace with your database password
  database: 'user_address_db',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error: ' + err.message);
  } else {
    console.log('Connected to the database');
  }
});

// Serve static files (HTML, CSS, images) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Create a new user and address
app.post('/submit', (req, res) => {
  const { name, address } = req.body;

  // Insert user into User table
  db.query('INSERT INTO User (name) VALUES (?)', [name], (err, results) => {
    if (err) {
      console.error('Error creating user: ' + err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const userId = results.insertId;

    // Insert address into Address table
    db.query(
      'INSERT INTO Address (user_id, street, city, state, postal_code) VALUES (?, ?, ?, ?, ?)',
      [userId, address.street, address.city, address.state, address.postal_code],
      (err) => {
        if (err) {
          console.error('Error creating address: ' + err.message);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.status(201).json({ message: 'User and address created successfully' });
      }
    );
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
