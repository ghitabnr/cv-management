const searchService = require('../src/services/searchService');
const dataService = require('../src/services/dataService');

jest.mock('../src/services/dataService');

describe('Service de recherche', () => {
  const mockCVs = [
    {
      id: 1,
      name: 'Ghita',
      lastname: 'Bounouara',
      email: 'gb@example.com',
      skills: ['JavaScript', 'React', 'Node.js'],
      experiences: [
        { years: 3, title: 'Developer', company: 'Tech Co' },
        { years: 2, title: 'Junior Developer', company: 'Startup Inc' }
      ]
    },
    {
      id: 2,
      name: 'Chaymae',
      lastname: 'El Boussaadany',
      email: 'ce@example.com',
      skills: ['Python', 'Django', 'SQL'],
      experiences: [
        { years: 4, title: 'Senior Developer', company: 'Big Corp' }
      ]
    },
    {
      id: 3,
      name: 'Hanane',
      lastname: 'Malki',
      email: 'hm@example.com',
      skills: ['JavaScript', 'Vue.js', 'Express'],
      experiences: [
        { years: 2, title: 'Developer', company: 'Capgemini' }
      ]
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    dataService.getAllCVs.mockReturnValue(mockCVs);
  });

  test('searchByName devrait filtrer les CVs par nom', () => {
    const results = searchService.searchByName('ghita');
    
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(1);
    expect(dataService.getAllCVs).toHaveBeenCalled();
  });

  test('searchByName avec un nom partiel devrait retourner les correspondances', () => {
    const results = searchService.searchByName('Hanane');
    
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(3);
  });

  test('searchByTechnology devrait filtrer les CVs par compétence', () => {
    const resultsJS = searchService.searchByTechnology('JavaScript');
    const resultsPython = searchService.searchByTechnology('Python');
    
    expect(resultsJS).toHaveLength(2);
    expect(resultsJS[0].id).toBe(1);
    expect(resultsJS[1].id).toBe(3);
    
    expect(resultsPython).toHaveLength(1);
    expect(resultsPython[0].id).toBe(2);
  });

  test('searchByExperience devrait filtrer les CVs par mois d\'expérience', () => {
    const results1 = searchService.searchByExperience(60);
    expect(results1).toHaveLength(1);
    expect(results1[0].id).toBe(1);

    
    const results2 = searchService.searchByExperience(24);
    expect(results2).toHaveLength(3);
    expect(results2[0].id).toBe(1);  
    expect(results2[1].id).toBe(2); 
    expect(results2[2].id).toBe(3); 
  });

  test('advancedSearch devrait combiner plusieurs critères de recherche', () => {
    const results = searchService.advancedSearch({
      name: 'ghita',
      skill: 'react'
    });
    
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(1);
  });
});
