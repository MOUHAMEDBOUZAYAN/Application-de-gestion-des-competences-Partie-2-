// src/models/Brief.js
const mongoose = require('mongoose');

const briefSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est obligatoire'],
    trim: true,
    maxLength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est obligatoire'],
    trim: true,
    maxLength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  objectifs: {
    type: String,
    required: [true, 'Les objectifs sont obligatoires'],
    trim: true
  },
  dureeEstimee: {
    type: Number,
    required: [true, 'La durée estimée est obligatoire'],
    min: [1, 'La durée doit être d\'au moins 1 heure']
  },
  niveau: {
    type: String,
    enum: ['Débutant', 'Intermédiaire', 'Avancé'],
    required: [true, 'Le niveau est obligatoire']
  },
  competences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competence'
  }],
  ressources: [{
    nom: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Document', 'Vidéo', 'Lien', 'Autre'],
      default: 'Document'
    }
  }],
  livrables: [{
    type: String,
    required: true
  }],
  criteresDEvaluation: [{
    type: String,
    required: true
  }],
  statut: {
    type: String,
    enum: ['Brouillon', 'Publié', 'Archivé'],
    default: 'Brouillon'
  },
  auteur: {
    type: String,
    required: [true, 'L\'auteur est obligatoire']
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware pour mettre à jour dateModification
briefSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.dateModification = Date.now();
  }
  next();
});

// Méthode pour obtenir les compétences associées
briefSchema.methods.getCompetencesDetails = async function() {
  try {
    const axios = require('axios');
    const competenceServiceUrl = process.env.COMPETENCE_SERVICE_URL || 'http://localhost:3001';
    
    const competencesPromises = this.competences.map(async (competenceId) => {
      const response = await axios.get(`${competenceServiceUrl}/api/competences/${competenceId}`);
      return response.data;
    });
    
    return await Promise.all(competencesPromises);
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    return [];
  }
};

// Méthode statique pour rechercher des briefs par compétence
briefSchema.statics.findByCompetence = function(competenceId) {
  return this.find({ competences: competenceId }).populate('competences');
};

// Méthode statique pour obtenir des statistiques
briefSchema.statics.getStatistiques = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$niveau',
        count: { $sum: 1 },
        dureeTotal: { $sum: '$dureeEstimee' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.model('Brief', briefSchema);