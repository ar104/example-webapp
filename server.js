const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Initialize SQLite Database
const db = new sqlite3.Database('./leads.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            interest TEXT NOT NULL,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        console.log('Database initialized.');
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint to handle form submission
app.post('/api/leads', (req, res) => {
    const { name, email, phone, interest, message } = req.body;

    if (!name || !email || !interest) {
        return res.status(400).json({ error: 'Name, email, and interest are required fields.' });
    }

    const sql = `INSERT INTO leads (name, email, phone, interest, message) VALUES (?, ?, ?, ?, ?)`;
    const params = [name, email, phone, interest, message];

    db.run(sql, params, function(err) {
        if (err) {
            console.error('Database insertion error:', err.message);
            return res.status(500).json({ error: 'Failed to save lead.' });
        }
        res.status(201).json({ message: 'Lead successfully captured!', id: this.lastID });
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
