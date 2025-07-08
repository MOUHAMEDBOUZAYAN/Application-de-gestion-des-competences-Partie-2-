// src/controllers/briefController.js
const Brief = require('../models/Brief');
const briefService = require('../services/briefService');
const { validationResult } = require('express-validator');
const axios = require('axios');

class BriefController {
  
  // Créer un nouveau brief
  async creerBrief(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Erreurs de validation',
          errors: errors.array()
        });
      }

      const briefData = req.body;
      const brief = await briefService.creerBrief(briefData);
      
      res.status(201).json({
        success: true,
        message: 'Brief créé avec succès',
        data: brief
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du brief',
        error: error.message
      });
    }
  }

  // Obtenir tous les briefs
  async obtenirBriefs(req, res) {
    try {
      const { page = 1, limit = 10, niveau, statut, competence } = req.query;
      
      const filters = {};
      if (niveau) filters.niveau = niveau;
      if (statut) filters.statut = statut;
      if (competence) filters.competences = competence;

      const briefs = await briefService.obtenirBriefs(filters, page, limit);
      
      res.json({
        success: true,
        data: briefs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des briefs',
        error: error.message
      });
    }
  }

  // Obtenir un brief par ID
  async obtenirBriefParId(req, res) {
    try {
      const { id } = req.params;
      const brief = await briefService.obtenirBriefParId(id);
      
      if (!brief) {
        return res.status(404).json({
          success: false,
          message: 'Brief non trouvé'
        });
      }

      res.json({
        success: true,
        data: brief
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du brief',
        error: error.message
      });
    }
  }

  // Mettre à jour un brief
  async mettreAJourBrief(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Erreurs de validation',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const briefData = req.body;
      
      const brief = await briefService.mettreAJourBrief(id, briefData);
      
      if (!brief) {
        return res.status(404).json({
          success: false,
          message: 'Brief non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Brief mis à jour avec succès',
        data: brief
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du brief',
        error: error.message
      });
    }
  }

  // Supprimer un brief
  async supprimerBrief(req, res) {
    try {
      const { id } = req.params;
      
      const brief = await briefService.supprimerBrief(id);
      
      if (!brief) {
        return res.status(404).json({
          success: false,
          message: 'Brief non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Brief supprimé avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du brief',
        error: error.message
      });
    }
  }

  // Associer des compétences à un brief
  async associerCompetences(req, res) {
    try {
      const { id } = req.params;
      const { competences } = req.body;

      if (!competences || !Array.isArray(competences)) {
        return res.status(400).json({
          success: false,
          message: 'Les compétences doivent être un tableau'
        });
      }

      const brief = await briefService.associerCompetences(id, competences);
      
      if (!brief) {
        return res.status(404).json({
          success: false,
          message: 'Brief non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Compétences associées avec succès',
        data: brief
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'association des compétences',
        error: error.message
      });
    }
  }

  // Obtenir les compétences d'un brief
  async obtenirCompetencesBrief(req, res) {
    try {
      const { id } = req.params;
      
      const brief = await Brief.findById(id);
      if (!brief) {
        return res.status(404).json({
          success: false,
          message: 'Brief non trouvé'
        });
      }

      const competences = await brief.getCompetencesDetails();
      
      res.json({
        success: true,
        data: {
          briefId: id,
          titre: brief.titre,
          competences: competences
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des compétences',
        error: error.message
      });
    }
  }

  // Obtenir les statistiques des briefs
  async obtenirStatistiques(req, res) {
    try {
      const statistiques = await briefService.obtenirStatistiques();
      
      res.json({
        success: true,
        data: statistiques
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  }

  // Rechercher des briefs par compétence
  async rechercherParCompetence(req, res) {
    try {
      const { competenceId } = req.params;
      
      const briefs = await Brief.findByCompetence(competenceId);
      
      res.json({
        success: true,
        data: briefs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche par compétence',
        error: error.message
      });
    }
  }

  // Vérifier la disponibilité d'un brief pour un apprenant
  async verifierDisponibilite(req, res) {
    try {
      const { id } = req.params;
      const { apprenantId } = req.query;
      
      const brief = await Brief.findById(id);
      if (!brief) {
        return res.status(404).json({
          success: false,
          message: 'Brief non trouvé'
        });
      }

      // Vérifier si l'apprenant peut accéder à ce brief
      const disponible = brief.statut === 'Publié';
      
      res.json({
        success: true,
        data: {
          briefId: id,
          disponible: disponible,
          statut: brief.statut
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de disponibilité',
        error: error.message
      });
    }
  }
}

module.exports = new BriefController();