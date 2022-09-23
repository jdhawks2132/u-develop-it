const express = require('express');
const mysql = require('mysql2');
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

app.listen(PORT, () => {
	console.log(`App listening on PORT: ${PORT}`);
});

// GET test route:
app.get('/api/test', (req, res) => {
	res.send('Hello World!');
});

// Default response for any other request (Not Found)
app.use((req, res) => {
	res.status(404).end();
});
