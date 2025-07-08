// src/services/briefService.js
const Brief = require('../models/Brief');
const axios = require('axios');

class BriefService {
  
  // Créer un nouveau brief
  async creerBrief(briefData) {
    try {
      // Vérifier que les compétences existent
      if (briefData.competences && briefData.competences.length > 0) {
        await this.verifierCompetencesExistent(briefData.competences);
      }

      const brief = new Brief(briefData);
      return await brief.save();
    } catch (error) {
      throw new Error(`Erreur lors de la création du brief: ${error.message}`);
    }
  }

  // Obtenir tous les briefs avec pagination et filtres
  async obtenirBriefs(filters = {}, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const query = Brief.find(filters);
      const briefs = await query
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ dateCreation: -1 });

      const total = await Brief.countDocuments(filters);
      
      return {
        briefs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des briefs: ${error.message}`);
    }
  }

  // Obtenir un brief par ID
  async obtenirBriefParId(id) {
    try {
      return await Brief.findById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du brief: ${error.message}`);
    }
  }

  // Mettre à jour un brief
  async mettreAJourBrief(id, briefData) {
    try {
      // Vérifier que les compétences existent si elles sont mises à jour
      if (briefData.competences && briefData.competences.length > 0) {
        await this.verifierCompetencesExistent(briefData.competences);
      }

      return await Brief.findByIdAndUpdate(
        id,
        { ...briefData, dateModification: Date.now() },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du brief: ${error.message}`);
    }
  }

  // Supprimer un brief
  async supprimerBrief(id) {
    try {
      // Vérifier si le brief est utilisé dans des rendus
      const utiliseDansRendus = await this.verifierUtilisationDansRendus(id);
      
      if (utiliseDansRendus) {
        throw new Error('Ce brief ne peut pas être supprimé car il est utilisé dans des rendus');
      }

      return await Brief.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du brief: ${error.message}`);
    }
  }

  // Associer des compétences à un brief
  async associerCompetences(briefId, competences) {
    try {
      // Vérifier que les compétences existent
      await this.verifierCompetencesExistent(competences);

      // Utiliser ES6+ - filtrer les compétences uniques
      const competencesUniques = [...new Set(competences)];

      return await Brief.findByIdAndUpdate(
        briefId,
        { 
          competences: competencesUniques,
          dateModification: Date.now()
        },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Erreur lors de l'association des compétences: ${error.message}`);
    }
  }

  // Obtenir les statistiques des briefs
  async obtenirStatistiques() {
    try {
      const statistiquesParNiveau = await Brief.getStatistiques();
      
      const statistiquesParStatut = await Brief.aggregate([
        {
          $group: {
            _id: '$statut',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalBriefs = await Brief.countDocuments();
      
      // Utiliser ES6+ - calculer les moyennes avec reduce
      const dureesMoyennes = statistiquesParNiveau.reduce((acc, stat) => {
        acc[stat._id] = stat.dureeTotal / stat.count;
        return acc;
      }, {});

      return {
        totalBriefs,
        statistiquesParNiveau,
        statistiquesParStatut,
        dureesMoyennes
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
    }
  }

  // Rechercher des briefs par mots-clés
  async rechercherBriefs(motsCles) {
    try {
      const regex = new RegExp(motsCles, 'i');
      
      return await Brief.find({
        $or: [
          { titre: regex },
          { description: regex },
          { objectifs: regex }
        ]
      }).sort({ dateCreation: -1 });
    } catch (error) {
      throw new Error(`Erreur lors de la recherche: ${error.message}`);
    }
  }

  // Obtenir les briefs d'un niveau spécifique
  async obtenirBriefsParNiveau(niveau) {
    try {
      return await Brief.find({ niveau }).sort({ dateCreation: -1 });
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des briefs par niveau: ${error.message}`);
    }
  }

  // Méthodes utilitaires privées

  // Vérifier que les compétences existent dans le service compétences
  async verifierCompetencesExistent(competences) {
    try {
      const competenceServiceUrl = process.env.COMPETENCE_SERVICE_URL || 'http://localhost:3001';
      
      // Utiliser ES6+ - map pour créer les promesses
      const verificationPromises = competences.map(async (competenceId) => {
        const response = await axios.get(`${competenceServiceUrl}/api/competences/${competenceId}`);
        return response.data;
      });

      await Promise.all(verificationPromises);
    } catch (error) {
      throw new Error('Une ou plusieurs compétences n\'existent pas');
    }
  }

  // Vérifier si un brief est utilisé dans des rendus
  async verifierUtilisationDansRendus(briefId) {
    try {
      const apprenantServiceUrl = process.env.APPRENANT_SERVICE_URL || 'http://localhost:3003';
      
      const response = await axios.get(`${apprenantServiceUrl}/api/rendus/brief/${briefId}`);
      return response.data.length > 0;
    } catch (error) {
      // Si le service n'est pas accessible, on assume qu'il n'y a pas d'utilisation
      console.warn('Service apprenant non accessible pour la vérification');
      return false;
    }
  }

  // Obtenir les briefs populaires (les plus utilisés)
  async obtenirBriefsPopulaires(limit = 10) {
    try {
      const apprenantServiceUrl = process.env.APPRENANT_SERVICE_URL || 'http://localhost:3003';
      
      // Récupérer les statistiques d'utilisation depuis le service apprenant
      const response = await axios.get(`${apprenantServiceUrl}/api/statistiques/briefs-populaires`);
      const statistiques = response.data;

      // Utiliser ES6+ - map pour récupérer les détails des briefs populaires
      const briefsPopulaires = await Promise.all(
        statistiques.slice(0, limit).map(async (stat) => {
          const brief = await Brief.findById(stat.briefId);
          return {
            ...brief.toObject(),
            nombreRendus: stat.nombreRendus
          };
        })
      );

      return briefsPopulaires;
    } catch (error) {
      // En cas d'erreur, retourner les briefs les plus récents
      return await Brief.find({ statut: 'Publié' })
        .sort({ dateCreation: -1 })
        .limit(limit);
    }
  }
}

module.exports = new BriefService();