const mongoose = require('mongoose');

// Schéma simple pour les sous-compétences
const sousCompetenceSchema = {
  nom: {
    type: String,
    required: true,
    trim: true
  },
  validee: {
    type: Boolean,
    default: false
  }
};

// Schéma principal
const competenceSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    match: /^C[1-8]$/  // Format C1 à C8
  },
  nom: {
    type: String,
    required: true,
    trim: true
  },
  sousCompetences: [sousCompetenceSchema]
}, {
  timestamps: true
});

// Méthode pour calculer le statut (simple et claire)
competenceSchema.methods.calculerStatut = function() {
  const validees = this.sousCompetences.filter(sc => sc.validee).length;
  const nonValidees = this.sousCompetences.length - validees;
  
  return {
    validees,
    nonValidees,
    statut: validees >= nonValidees ? 'validée' : 'non validée'
  };
};

module.exports = mongoose.model('Competence', competenceSchema);