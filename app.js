const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

const users = []; // Aquí se almacenarán los usuarios de ejemplo

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).send('Usuario registrado');
  } catch (error) {
    res.status(500).send('Error en el registro');
  }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
      res.send('Autenticación satisfactoria');
    } else {
      res.status(401).send('Error en la autenticación');
    }
  } catch (error) {
    res.status(500).send('Error en la autenticación');
  }
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
