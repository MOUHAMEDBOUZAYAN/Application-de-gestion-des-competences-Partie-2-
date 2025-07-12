const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const competencesRoutes = require('./routes/competences');

const app = express();

// Middlewares simples
app.use(cors());
app.use(express.json());

// Connexion MongoDB simple
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// Routes
app.use('/api/competences', competencesRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'API Gestion de Compétences - 404.js',
    version: '1.0.0',
    endpoints: {
      competences: '/api/competences'
    }
  });
});

// Gestion d'erreurs simple
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur interne'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

module.exports = app;