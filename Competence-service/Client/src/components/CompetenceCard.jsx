import React, { useState } from 'react';
import { Check, X, Trash2, MoreVertical, Plus, Edit3 } from 'lucide-react';

const CompetenceCard = ({ competence, onToggleSousCompetence, onDelete, onAddSousCompetence }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [newSousComp, setNewSousComp] = useState('');
  const [adding, setAdding] = useState(false);
  const { _id, code, nom, sousCompetences, evaluation } = competence;
  const isValidee = evaluation?.statut === 'validée';

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      onDelete(_id);
    }
    setShowMenu(false);
  };

  const handleAddSousCompetence = async () => {
    if (!newSousComp.trim()) return;
    setAdding(true);
    await onAddSousCompetence(_id, newSousComp.trim());
    setNewSousComp('');
    setAdding(false);
  };

  return (
    <div className="competence-card group">
      {/* En-tête */}
      <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className={`status-badge ${
              isValidee 
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
            }`}>
              <span className="font-mono font-bold">{code}</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                {nom}
              </h3>
              <p className="text-gray-600 flex items-center space-x-2">
                <span className="flex items-center space-x-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{evaluation?.validees || 0}</span>
                </span>
                <span className="text-gray-400">/</span>
                <span>{sousCompetences?.length || 0} sous-compétences validées</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`status-badge flex items-center space-x-2 ${
                isValidee 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                  : 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
              }`}>
                {isValidee ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                <span className="font-semibold">{evaluation?.statut || 'non validée'}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2 font-medium">{evaluation?.pourcentage || 0}% complété</p>
            </div>
            
            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200 group-hover:bg-gray-50"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 z-20 animate-slide-in-right">
                  <div className="p-2">
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl flex items-center space-x-3 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="font-medium">Supprimer la compétence</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="mt-6">
          <div className="progress-bar">
            <div
              className={`progress-fill ${
                isValidee 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-red-500 to-pink-500'
              }`}
              style={{ width: `${evaluation?.pourcentage || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Sous-compétences */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <Edit3 className="h-5 w-5 text-blue-500" />
            <span>Sous-compétences</span>
          </h4>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {sousCompetences?.length || 0} éléments
          </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {sousCompetences?.map((sousComp, index) => (
            <div
              key={index}
              className={`sous-comp-item group/item ${
                sousComp.validee 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300' 
                  : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onToggleSousCompetence(_id, index)}
            >
              <span className={`font-medium transition-colors duration-200 ${
                sousComp.validee ? 'text-green-800' : 'text-gray-700'
              }`}>
                {sousComp.nom}
              </span>
              <div className={`p-2 rounded-full transition-all duration-200 group-hover/item:scale-110 ${
                sousComp.validee 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg' 
                  : 'bg-gray-300 group-hover/item:bg-gray-400'
              }`}>
                {sousComp.validee ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <X className="h-4 w-4 text-gray-600" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Ajout de sous-compétence */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <h5 className="text-sm font-semibold text-blue-800 mb-4 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Ajouter une sous-compétence</span>
          </h5>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newSousComp}
              onChange={e => setNewSousComp(e.target.value)}
              placeholder="Nom de la sous-compétence..."
              className="input-field flex-1"
              disabled={adding}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSousCompetence()}
            />
            <button
              type="button"
              onClick={handleAddSousCompetence}
              className="btn-success flex items-center px-4 py-3"
              disabled={adding || !newSousComp.trim()}
            >
              <Plus className="h-4 w-4 mr-2" /> 
              Ajouter
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay pour fermer le menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default CompetenceCard;