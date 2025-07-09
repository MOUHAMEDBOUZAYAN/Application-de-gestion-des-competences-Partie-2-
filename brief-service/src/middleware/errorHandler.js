// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur
  console.error('🚨 Erreur:', err);

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400
    };
  }

  // Erreur de duplication Mongoose
  if (err.code === 11000) {
    const message = 'Ressource déjà existante';
    error = {
      message,
      statusCode: 400
    };
  }

  // Erreur ObjectId Mongoose
  if (err.name === 'CastError') {
    const message = 'Ressource non trouvée';
    error = {
      message,
      statusCode: 404
    };
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token non valide';
    error = {
      message,
      statusCode: 401
    };
  }

  // Erreur JWT expiration
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expiré';
    error = {
      message,
      statusCode: 401
    };
  }

  // Erreur de connexion réseau
  if (err.code === 'ECONNREFUSED') {
    const message = 'Service externe non disponible';
    error = {
      message,
      statusCode: 503
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;