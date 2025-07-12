import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, User, BookOpen, Check, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import des composants
import LoadingSpinner from './components/LoadingSpinner';
import StatCard from './components/StatCard';
import CompetenceCard from './components/CompetenceCard';
import CompetenceForm from './components/CompetenceForm';

// Import du service API
import { competenceService } from './services/api';

const App = () => {
  const [competences, setCompetences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // Calcul des statistiques
  const calculateStats = (competencesList) => {
    return competencesList.reduce((acc, comp) => {
      const validees = comp.sousCompetences?.filter(sc => sc.validee).length || 0;
      const total = comp.sousCompetences?.length || 0;
      const isValidee = validees >= (total - validees);
      
      return {
        totalCompetences: acc.totalCompetences + 1,
        competencesValidees: acc.competencesValidees + (isValidee ? 1 : 0),
        totalSousCompetences: acc.totalSousCompetences + total,
        sousCompetencesValidees: acc.sousCompetencesValidees + validees
      };
    }, {
      totalCompetences: 0,
      competencesValidees: 0,
      totalSousCompetences: 0,
      sousCompetencesValidees: 0
    });
  };

  // Calcul du statut d'une compétence
  const calculateEvaluation = (sousCompetences) => {
    const validees = sousCompetences.filter(sc => sc.validee).length;
    const nonValidees = sousCompetences.length - validees;
    
    return {
      validees,
      nonValidees,
      statut: validees >= nonValidees ? 'validée' : 'non validée',
      pourcentage: Math.round((validees / sousCompetences.length) * 100)
    };
  };

  // Chargement des compétences
  const loadCompetences = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await competenceService.getAll();
      
      // Ajouter l'évaluation à chaque compétence
      const competencesWithEvaluation = data.data?.map(comp => ({
        ...comp,
        evaluation: calculateEvaluation(comp.sousCompetences || [])
      })) || [];
      
      setCompetences(competencesWithEvaluation);
      setStats(calculateStats(competencesWithEvaluation));
    } catch (err) {
      setError('Impossible de charger les compétences. Vérifiez que votre API est démarrée.');
      setCompetences([]);
      setStats({
        totalCompetences: 0,
        competencesValidees: 0,
        totalSousCompetences: 0,
        sousCompetencesValidees: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Effet de chargement initial
  useEffect(() => {
    loadCompetences();
  }, []);

  // Créer une nouvelle compétence
  const handleCreateCompetence = async (formData) => {
    try {
      setFormLoading(true);
      await competenceService.create(formData);
      setShowForm(false);
      await loadCompetences(); // Recharger la liste
    } catch (err) {
      toast.error('Erreur lors de la création de la compétence');
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle d'une sous-compétence
  const handleToggleSousCompetence = async (competenceId, sousCompIndex) => {
    try {
      const competence = competences.find(c => c._id === competenceId);
      const newSousCompetences = [...competence.sousCompetences];
      newSousCompetences[sousCompIndex].validee = !newSousCompetences[sousCompIndex].validee;

      // Mise à jour optimiste (UI d'abord)
      const updatedCompetences = competences.map(comp => {
        if (comp._id === competenceId) {
          return {
            ...comp,
            sousCompetences: newSousCompetences,
            evaluation: calculateEvaluation(newSousCompetences)
          };
        }
        return comp;
      });
      
      setCompetences(updatedCompetences);
      setStats(calculateStats(updatedCompetences));

      // Puis mise à jour sur le serveur
      await competenceService.updateEvaluation(competenceId, newSousCompetences);
    } catch (err) {
      // En cas d'erreur, recharger les données
      loadCompetences();
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Supprimer une compétence
  const handleDeleteCompetence = async (competenceId) => {
    try {
      await competenceService.delete(competenceId);
      await loadCompetences(); // Recharger la liste
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Ajouter une sous-compétence à une compétence existante
  const handleAddSousCompetence = async (competenceId, sousCompNom) => {
    try {
      const competence = competences.find(c => c._id === competenceId);
      const newSousCompetences = [
        ...competence.sousCompetences,
        { nom: sousCompNom, validee: false }
      ];
      // Mise à jour optimiste
      const updatedCompetences = competences.map(comp => {
        if (comp._id === competenceId) {
          return {
            ...comp,
            sousCompetences: newSousCompetences,
            evaluation: calculateEvaluation(newSousCompetences)
          };
        }
        return comp;
      });
      setCompetences(updatedCompetences);
      setStats(calculateStats(updatedCompetences));
      // Mise à jour sur le serveur
      await competenceService.updateEvaluation(competenceId, newSousCompetences);
      toast.success('Sous-compétence ajoutée !');
    } catch (err) {
      loadCompetences();
      toast.error('Erreur lors de l\'ajout de la sous-compétence');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement des compétences..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="header-gradient sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Gestion des Compétences
                </h1>
                <p className="text-sm text-gray-600 mt-1">404.js - Suivi des formations</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-3 animate-fade-in-up"
            >
              <Plus className="h-5 w-5" />
              <span>Nouvelle compétence</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Message d'erreur */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 animate-fade-in-up">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-full">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium">{error}</p>
                <button 
                  onClick={loadCompetences}
                  className="mt-2 text-sm underline hover:no-underline font-medium"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <StatCard
                icon={<BarChart3 className="h-7 w-7" />}
                title="Compétences totales"
                value={stats.totalCompetences}
                color="blue"
              />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <StatCard
                icon={<Check className="h-7 w-7" />}
                title="Compétences validées"
                value={stats.competencesValidees}
                color="green"
              />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <StatCard
                icon={<User className="h-7 w-7" />}
                title="Sous-compétences"
                value={stats.totalSousCompetences}
                color="purple"
              />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <StatCard
                icon={<BookOpen className="h-7 w-7" />}
                title="Validées"
                value={stats.sousCompetencesValidees}
                color="orange"
              />
            </div>
          </div>
        )}

        {/* Liste des compétences */}
        <div className="space-y-8">
          {competences.length === 0 ? (
            <div className="text-center py-16 animate-fade-in-up">
              <div className="p-8 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune compétence trouvée</h3>
                <p className="text-gray-500 mb-6">Commencez par ajouter votre première compétence</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Ajouter une compétence
                </button>
              </div>
            </div>
          ) : (
            competences.map((competence, index) => (
              <div 
                key={competence._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <CompetenceCard
                  competence={competence}
                  onToggleSousCompetence={handleToggleSousCompetence}
                  onDelete={handleDeleteCompetence}
                  onAddSousCompetence={handleAddSousCompetence}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal du formulaire de création */}
      {showForm && (
        <div className="modal-overlay" onClick={() => !formLoading && setShowForm(false)}>
          <div className="modal-content animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setShowForm(false)}
              disabled={formLoading}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Nouvelle compétence
              </h2>
              <p className="text-gray-600 mt-2">Ajoutez une nouvelle compétence à votre portfolio</p>
            </div>
            <CompetenceForm
              isOpen={true}
              onClose={() => setShowForm(false)}
              onSubmit={handleCreateCompetence}
              loading={formLoading}
            />
          </div>
        </div>
      )}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;