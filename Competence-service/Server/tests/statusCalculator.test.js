const { calculerStatutCompetence, calculerStatistiquesGlobales } = require('../src/utils/statusCalculator');

describe('Calculateur de statut', () => {
  
  test('devrait calculer le statut validé quand validées >= non validées', () => {
    const sousCompetences = [
      { nom: 'SC1', validee: true },
      { nom: 'SC2', validee: true },
      { nom: 'SC3', validee: false }
    ];

    const resultat = calculerStatutCompetence(sousCompetences);

    expect(resultat.statut).toBe('validée');
    expect(resultat.validees).toBe(2);
    expect(resultat.nonValidees).toBe(1);
  });

  test('devrait calculer le statut non validé quand validées < non validées', () => {
    const sousCompetences = [
      { nom: 'SC1', validee: true },
      { nom: 'SC2', validee: false },
      { nom: 'SC3', validee: false }
    ];

    const resultat = calculerStatutCompetence(sousCompetences);

    expect(resultat.statut).toBe('non validée');
    expect(resultat.validees).toBe(1);
    expect(resultat.nonValidees).toBe(2);
  });

});