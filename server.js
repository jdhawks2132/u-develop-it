const express = require('express');
const inputCheck = require('./utils/inputCheck');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
	res.status(404).end();
});

db.connect((err) => {
	if (err) throw err;
	console.log('Database connected.');
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});