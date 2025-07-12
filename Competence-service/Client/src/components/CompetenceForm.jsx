import React, { useState } from 'react';
import { X, Plus, Trash2, BookOpen, Code, Edit3 } from 'lucide-react';

const CompetenceForm = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    sousCompetences: [{ nom: '', validee: false }]
  });

  const [errors, setErrors] = useState({});

  // Validation simple
  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Le code est requis';
    } else if (!/^C[1-8]$/.test(formData.code)) {
      newErrors.code = 'Format: C1 à C8';
    }

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (formData.sousCompetences.length === 0) {
      newErrors.sousCompetences = 'Au moins une sous-compétence est requise';
    }

    formData.sousCompetences.forEach((sc, index) => {
      if (!sc.nom.trim()) {
        newErrors[`sousComp_${index}`] = 'Nom requis';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      nom: '',
      sousCompetences: [{ nom: '', validee: false }]
    });
    setErrors({});
  };

  const addSousCompetence = () => {
    setFormData(prev => ({
      ...prev,
      sousCompetences: [...prev.sousCompetences, { nom: '', validee: false }]
    }));
  };

  const removeSousCompetence = (index) => {
    if (formData.sousCompetences.length > 1) {
      setFormData(prev => ({
        ...prev,
        sousCompetences: prev.sousCompetences.filter((_, i) => i !== index)
      }));
    }
  };

  const updateSousCompetence = (index, value) => {
    setFormData(prev => ({
      ...prev,
      sousCompetences: prev.sousCompetences.map((sc, i) => 
        i === index ? { ...sc, nom: value } : sc
      )
    }));
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Code */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
          <Code className="h-4 w-4 text-blue-500" />
          <span>Code de la compétence *</span>
        </label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
          placeholder="Ex: C1, C2, C3..."
          className={`input-field ${
            errors.code ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
          }`}
        />
        {errors.code && (
          <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
            <X className="h-3 w-3" />
            <span>{errors.code}</span>
          </p>
        )}
      </div>

      {/* Nom */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
          <BookOpen className="h-4 w-4 text-blue-500" />
          <span>Nom de la compétence *</span>
        </label>
        <input
          type="text"
          value={formData.nom}
          onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
          placeholder="Ex: Développement Frontend"
          className={`input-field ${
            errors.nom ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
          }`}
        />
        {errors.nom && (
          <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
            <X className="h-3 w-3" />
            <span>{errors.nom}</span>
          </p>
        )}
      </div>

      {/* Sous-compétences */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <Edit3 className="h-4 w-4 text-blue-500" />
            <span>Sous-compétences *</span>
          </label>
          <button
            type="button"
            onClick={addSousCompetence}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </button>
        </div>

        <div className="space-y-4">
          {formData.sousCompetences.map((sousComp, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-1">
                <input
                  type="text"
                  value={sousComp.nom}
                  onChange={(e) => updateSousCompetence(index, e.target.value)}
                  placeholder={`Sous-compétence ${index + 1}`}
                  className={`input-field bg-white ${
                    errors[`sousComp_${index}`] ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                />
                {errors[`sousComp_${index}`] && (
                  <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                    <X className="h-3 w-3" />
                    <span>{errors[`sousComp_${index}`]}</span>
                  </p>
                )}
              </div>
              {formData.sousCompetences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSousCompetence(index)}
                  className="btn-danger p-3 flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.sousCompetences && (
          <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
            <X className="h-3 w-3" />
            <span>{errors.sousCompetences}</span>
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={() => {
            onClose();
            resetForm();
          }}
          className="btn-secondary flex-1 py-3"
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn-primary flex-1 py-3"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="loading-spinner h-4 w-4"></div>
              <span>Création...</span>
            </div>
          ) : (
            'Créer la compétence'
          )}
        </button>
      </div>
    </form>
  );
};

export default CompetenceForm;