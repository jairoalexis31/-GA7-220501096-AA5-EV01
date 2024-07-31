const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

// Ruta para registrar un nuevo usuario
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required!' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    
// Insertar el nuevo usuario en la base de datos

    db.run(query, [username, hashedPassword], function(err) {
        if (err) {
            return res.status(500).json({ message: 'User registration failed!' });
        }
        res.status(201).json({ message: 'User registered successfully!' });
    });
});

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

//Verificar que el nombre de usuario y la contraseña no estén vacíos

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required!' });
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Authentication failed!' });
        }
//Generar un hash de la contraseña para almacenarla de manera segura

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Authentication failed!' });
        }

        res.status(200).json({ message: 'Authentication successful!' });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
