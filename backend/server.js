// backend/server.js
import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Ruta para leer el archivo JSON
app.get('/api/data', (req, res) => {
  try {
    const data = fs.readFileSync('data.json', 'utf-8');
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer el archivo JSON' });
  }
});

// Ruta para guardar datos en el archivo JSON
app.post('/api/data', (req, res) => {
  try {
    const newData = req.body; // Datos enviados en el POST
    fs.writeFileSync('data.json', JSON.stringify(newData, null, 2), 'utf-8');
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar los datos' });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
