const mongoose = require('mongoose');

const renduSchema = new mongoose.Schema({
  briefId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  apprenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apprenant',
    required: true
  },
  lien: {
    type: String,
    required: true
  },
  dateSoumission: {
    type: Date,
    default: Date.now
  },
  statut: {
    type: String,
    enum: ['soumis', 'validé', 'en attente'],
    default: 'soumis'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Rendu', renduSchema);
