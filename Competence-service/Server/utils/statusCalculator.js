// Fonctions utilitaires avec HOF (Higher Order Functions)

// Calcule le statut d'une compétence
const calculerStatutCompetence = (sousCompetences) => {
  const validees = sousCompetences
    .filter(sc => sc.validee)
    .length;
  
  const total = sousCompetences.length;
  const nonValidees = total - validees;
  
  return {
    validees,
    nonValidees,
    total,
    statut: validees >= nonValidees ? 'validée' : 'non validée',
    pourcentage: Math.round((validees / total) * 100)
  };
};

// Calcule les statistiques globales avec reduce
const calculerStatistiquesGlobales = (competences) => {
  return competences.reduce((stats, competence) => {
    const { statut, validees, total } = calculerStatutCompetence(competence.sousCompetences);
    
    return {
      ...stats,
      totalCompetences: stats.totalCompetences + 1,
      competencesValidees: stats.competencesValidees + (statut === 'validée' ? 1 : 0),
      totalSousCompetences: stats.totalSousCompetences + total,
      sousCompetencesValidees: stats.sousCompetencesValidees + validees
    };
  }, {
    totalCompetences: 0,
    competencesValidees: 0,
    totalSousCompetences: 0,
    sousCompetencesValidees: 0
  });
};

// Filtre les compétences par statut avec filter
const filtrerParStatut = (competences, statutRecherche) => {
  return competences.filter(competence => {
    const { statut } = calculerStatutCompetence(competence.sousCompetences);
    return statut === statutRecherche;
  });
};

module.exports = {
  calculerStatutCompetence,
  calculerStatistiquesGlobales,
  filtrerParStatut
};