import axios from 'axios';

// Configuration de base de l'API
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error);
    return Promise.reject(error);
  }
);

// Services API
export const competenceService = {
  // Récupérer toutes les compétences
  getAll: async () => {
    try {
      const response = await api.get('/competences');
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des compétences');
    }
  },

  // Créer une nouvelle compétence
  create: async (competenceData) => {
    try {
      const response = await api.post('/competences', competenceData);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la création de la compétence');
    }
  },

  // Mettre à jour une compétence
  updateEvaluation: async (id, sousCompetences) => {
    try {
      const response = await api.put(`/competences/${id}/evaluation`, {
        sousCompetences
      });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour');
    }
  },

  // Supprimer une compétence
  delete: async (id) => {
    try {
      const response = await api.delete(`/competences/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la suppression');
    }
  }
};

export default api;