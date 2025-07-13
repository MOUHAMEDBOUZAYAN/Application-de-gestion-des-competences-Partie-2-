require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());


const renduRoutes = require('./routes/rendu.routes');
const apprenantRoutes = require('./routes/apprenant.routes');

app.use('/rendus', renduRoutes);
app.use('/apprenants', apprenantRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenue dans le service Apprenant');
});

module.exports = app;
