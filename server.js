const express = require('express');
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
	{
		host: 'localhost',
		// MySQL username,
		user: 'root',
		database: 'election',
	},
	console.log('Connected to the election database.')
);

// GET test route:
app.get('/api/test', (req, res) => {
	res.send('Hello World!');
});

// GET all candidates:
app.get('/api/candidates', (req, res) => {
	const sql = `SELECT * FROM candidates`;
	db.query(sql, (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.json({
			message: 'success',
			data: rows,
		});
	});
});

// GET a single candidate:
app.get('/api/candidate/:id', (req, res) => {
	const sql = `SELECT * FROM candidates WHERE id = ?`;
	const params = [req.params.id];
	db.query(sql, params, (err, row) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: 'success',
			data: row,
		});
	});
});

// DELETE a candidate:
app.delete('/api/candidate/:id', (req, res) => {
	const sql = `DELETE FROM candidates WHERE id = ?`;
	const params = [req.params.id];
	db.query(sql, params, (err, result) => {
		if (err) {
			res.statusMessage(400).json({ error: res.message });
		} else if (!result.affectedRows) {
			res.json({
				message: 'Candidate not found',
			});
		} else {
			res.json({
				message: 'successfully deleted',
				changes: result.affectedRows,
				id: req.params.id,
			});
		}
	});
});

// Create a candidate use inputCheck to validate data:
app.post('/api/candidate', ({ body }, res) => {
	const errors = inputCheck(
		body,
		'first_name',
		'last_name',
		'industry_connected'
	);
	if (errors) {
		res.status(400).json({ error: errors.message });
		return;
	}
	const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
  VALUES (?,?,?)`;
	const params = [body.first_name, body.last_name, body.industry_connected];
	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: 'success',
			data: body,
		});
	});
});

// Default response for any other request (Not Found)
app.use((req, res) => {
	res.status(404).end();
});

app.listen(PORT, () => {
	console.log(`App listening on PORT: ${PORT}`);
});
