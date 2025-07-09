// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const briefRoutes = require('./routes/briefRoutes');
const errorHandler = require('./middleware/errorHandler');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connexion à la base de données
connectDB();

// Routes
app.use('/api/briefs', briefRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Brief Service is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

const PORT = process.env.PORT || 3002;

const server = app.listen(PORT, () => {
  console.log(`🚀 Brief Service en cours d'exécution sur le port ${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM reçu, arrêt du serveur...');
  server.close(() => {
    console.log('💤 Serveur fermé');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT reçu, arrêt du serveur...');
  server.close(() => {
    console.log('💤 Serveur fermé');
    process.exit(0);
  });
});

module.exports = app;