const express = require('express');
const Competence = require('../models/Competence');
const { calculerStatutCompetence, calculerStatistiquesGlobales } = require('../utils/statusCalculator');

const router = express.Router();

// GET /competences - Lister toutes les compétences
router.get('/', async (req, res) => {
  try {
    const competences = await Competence.find();
    
    // Utilisation de map pour ajouter le statut à chaque compétence
    const competencesAvecStatut = competences.map(competence => ({
      ...competence.toObject(),
      evaluation: calculerStatutCompetence(competence.sousCompetences)
    }));

    // Statistiques globales
    const stats = calculerStatistiquesGlobales(competences);

    res.json({
      success: true,
      data: competencesAvecStatut,
      statistiques: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des compétences',
      error: error.message
    });
  }
});

// GET /competences/:id - Récupérer une compétence
router.get('/:id', async (req, res) => {
  try {
    const competence = await Competence.findById(req.params.id);
    
    if (!competence) {
      return res.status(404).json({
        success: false,
        message: 'Compétence non trouvée'
      });
    }

    res.json({
      success: true,
      data: {
        ...competence.toObject(),
        evaluation: calculerStatutCompetence(competence.sousCompetences)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la compétence',
      error: error.message
    });
  }
});

// POST /competences - Créer une compétence
router.post('/', async (req, res) => {
  console.log('POST /api/competences called', req.body);
  try {
    const { code, nom, sousCompetences = [] } = req.body;

    const nouvelleCompetence = new Competence({
      code,
      nom,
      sousCompetences
    });

    const competenceSauvee = await nouvelleCompetence.save();

    res.status(201).json({
      success: true,
      message: 'Compétence créée avec succès',
      data: {
        ...competenceSauvee.toObject(),
        evaluation: calculerStatutCompetence(competenceSauvee.sousCompetences)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de la compétence',
      error: error.message
    });
  }
});

// PUT /competences/:id/evaluation - Mettre à jour les évaluations
router.put('/:id/evaluation', async (req, res) => {
  try {
    const { sousCompetences } = req.body;
    
    const competence = await Competence.findByIdAndUpdate(
      req.params.id,
      { sousCompetences },
      { new: true, runValidators: true }
    );

    if (!competence) {
      return res.status(404).json({
        success: false,
        message: 'Compétence non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Évaluation mise à jour avec succès',
      data: {
        ...competence.toObject(),
        evaluation: calculerStatutCompetence(competence.sousCompetences)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
});

// DELETE /competences/:id - Supprimer une compétence
router.delete('/:id', async (req, res) => {
  try {
    const competence = await Competence.findByIdAndDelete(req.params.id);

    if (!competence) {
      return res.status(404).json({
        success: false,
        message: 'Compétence non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Compétence supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
});

module.exports = router;