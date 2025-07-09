// src/routes/briefRoutes.js
const express = require('express');
const { body, param, query } = require('express-validator');
const briefController = require('../controllers/briefController');

const router = express.Router();

// Validateurs
const briefValidation = [
  body('titre')
    .notEmpty()
    .withMessage('Le titre est obligatoire')
    .isLength({ max: 200 })
    .withMessage('Le titre ne peut pas dépasser 200 caractères'),
  body('description')
    .notEmpty()
    .withMessage('La description est obligatoire')
    .isLength({ max: 2000 })
    .withMessage('La description ne peut pas dépasser 2000 caractères'),
  body('objectifs')
    .notEmpty()
    .withMessage('Les objectifs sont obligatoires'),
  body('dureeEstimee')
    .isInt({ min: 1 })
    .withMessage('La durée estimée doit être un nombre entier positif'),
  body('niveau')
    .isIn(['Débutant', 'Intermédiaire', 'Avancé'])
    .withMessage('Le niveau doit être Débutant, Intermédiaire ou Avancé'),
  body('auteur')
    .notEmpty()
    .withMessage('L\'auteur est obligatoire'),
  body('competences')
    .optional()
    .isArray()
    .withMessage('Les compétences doivent être un tableau'),
  body('ressources')
    .optional()
    .isArray()
    .withMessage('Les ressources doivent être un tableau'),
  body('livrables')
    .optional()
    .isArray()
    .withMessage('Les livrables doivent être un tableau'),
  body('criteresDEvaluation')
    .optional()
    .isArray()
    .withMessage('Les critères d\'évaluation doivent être un tableau'),
  body('statut')
    .optional()
    .isIn(['Brouillon', 'Publié', 'Archivé'])
    .withMessage('Le statut doit être Brouillon, Publié ou Archivé')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('L\'ID doit être un ObjectId MongoDB valide')
];

const competenceValidation = [
  body('competences')
    .isArray({ min: 1 })
    .withMessage('Les compétences doivent être un tableau non vide'),
  body('competences.*')
    .isMongoId()
    .withMessage('Chaque compétence doit être un ObjectId MongoDB valide')
];

// Routes CRUD pour les briefs

// GET /api/briefs - Obtenir tous les briefs
router.get('/', briefController.obtenirBriefs);

// GET /api/briefs/:id - Obtenir un brief par ID
router.get('/:id', idValidation, briefController.obtenirBriefParId);

// POST /api/briefs - Créer un nouveau brief
router.post('/', briefValidation, briefController.creerBrief);

// PUT /api/briefs/:id - Mettre à jour un brief
router.put('/:id', [...idValidation, ...briefValidation], briefController.mettreAJourBrief);

// DELETE /api/briefs/:id - Supprimer un brief
router.delete('/:id', idValidation, briefController.supprimerBrief);

// Routes pour la gestion des compétences

// POST /api/briefs/:id/competences - Associer des compétences à un brief
router.post('/:id/competences', 
  [...idValidation, ...competenceValidation], 
  briefController.associerCompetences
);

// GET /api/briefs/:id/competences - Obtenir les compétences d'un brief
router.get('/:id/competences', idValidation, briefController.obtenirCompetencesBrief);

// Routes de recherche et statistiques

// GET /api/briefs/recherche/competence/:competenceId - Rechercher des briefs par compétence
router.get('/recherche/competence/:competenceId', 
  param('competenceId').isMongoId().withMessage('L\'ID de compétence doit être un ObjectId MongoDB valide'),
  briefController.rechercherParCompetence
);

// GET /api/briefs/statistiques - Obtenir les statistiques des briefs
router.get('/statistiques', briefController.obtenirStatistiques);

// Routes pour l'intégration avec le service apprenant

// GET /api/briefs/:id/disponibilite - Vérifier la disponibilité d'un brief pour un apprenant
router.get('/:id/disponibilite',
  [
    ...idValidation,
    query('apprenantId').optional().isMongoId().withMessage('L\'ID apprenant doit être un ObjectId MongoDB valide')
  ],
  briefController.verifierDisponibilite
);

module.exports = router;