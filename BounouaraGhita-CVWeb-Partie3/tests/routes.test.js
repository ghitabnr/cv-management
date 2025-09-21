const request = require('supertest');
const express = require('express');
const cvRoutes = require('../src/controllers/api');
const dataService = require('../src/services/dataService');
const searchService = require('../src/services/searchService');
const pdfService = require('../src/services/pdfService');

jest.mock('../src/services/dataService');
jest.mock('../src/services/searchService');
jest.mock('../src/services/pdfService');

describe('API Routes', () => {
  let app;
  
  const mockCVs = [
    {
      id: 1,
      name: 'ghita',
      lastname: 'bounouara',
      email: 'gb@example.com'
    },
    {
      id: 2,
      name: 'chaymae',
      lastname: 'el boussaadany',
      email: 'ce@example.com'
    }
  ];
  
  const mockCV = mockCVs[0];
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    dataService.getAllCVs.mockReturnValue(mockCVs);
    dataService.getCVById.mockImplementation((id) => {
      return mockCVs.find(cv => cv.id === id);
    });
    dataService.createCV.mockImplementation((data) => ({ id: 3, ...data }));
    
    searchService.searchByName.mockReturnValue([mockCV]);
    searchService.searchByTechnology.mockReturnValue([mockCV]);
    searchService.searchByExperience.mockReturnValue([mockCV]);
    
    pdfService.generatePDF.mockResolvedValue(Buffer.from('mock pdf content'));
    
    app = express();
    app.use(express.json());
    app.use('/api', cvRoutes);
  });
  
  describe('GET /api/cvs', () => {
    test('devrait retourner tous les CVs', async () => {
      const response = await request(app).get('/api/cvs');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCVs);
      expect(dataService.getAllCVs).toHaveBeenCalled();
    });
    
    test('devrait gérer les erreurs', async () => {
      dataService.getAllCVs.mockImplementation(() => {
        throw new Error('Erreur de test');
      });
      
      const response = await request(app).get('/api/cvs');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('GET /api/cvs/:id', () => {
    test('devrait retourner un CV par ID', async () => {
      const response = await request(app).get('/api/cvs/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCV);
      expect(dataService.getCVById).toHaveBeenCalledWith(1);
    });
    
    test('devrait retourner 404 pour un ID inexistant', async () => {
      dataService.getCVById.mockReturnValue(null);
      
      const response = await request(app).get('/api/cvs/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('POST /api/cvs', () => {
    test('devrait créer un nouveau CV', async () => {
      const newCV = {
        name: 'New',
        email: 'new@example.com'
      };
      
      const response = await request(app)
        .post('/api/cvs')
        .send(newCV);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 3);
      expect(dataService.createCV).toHaveBeenCalledWith(newCV);
    });
    
    test('devrait gérer les erreurs de validation', async () => {
      dataService.createCV.mockImplementation(() => {
        throw new Error('Données invalides');
      });
      
      const response = await request(app)
        .post('/api/cvs')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('GET /api/search/name/:name', () => {
    test('devrait rechercher les CVs par nom', async () => {
      const response = await request(app).get('/api/search/name/ghita');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockCV]);
      expect(searchService.searchByName).toHaveBeenCalledWith('ghita');
    });
  });
  
  describe('GET /api/search/technology/:tech', () => {
    test('devrait rechercher les CVs par technologie', async () => {
      const response = await request(app).get('/api/search/technology/javascript');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockCV]);
      expect(searchService.searchByTechnology).toHaveBeenCalledWith('javascript');
    });
  });
  
  describe('GET /api/search/experience/:years', () => {
    test('devrait rechercher les CVs par années d\'expérience', async () => {
      const response = await request(app).get('/api/search/experience/5');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockCV]);
      expect(searchService.searchByExperience).toHaveBeenCalledWith(5);
    });
  });
  
  describe('GET /api/cvs/:id/pdf', () => {
    test('devrait générer un PDF pour un CV existant', async () => {
      const response = await request(app).get('/api/cvs/1/pdf');
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/pdf');
      expect(dataService.getCVById).toHaveBeenCalledWith(1);
      expect(pdfService.generatePDF).toHaveBeenCalledWith(mockCV);
    });
    
    test('devrait retourner 404 pour un CV inexistant', async () => {
      dataService.getCVById.mockReturnValue(null);
      
      const response = await request(app).get('/api/cvs/999/pdf');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
    
    test('devrait gérer les erreurs lors de la génération du PDF', async () => {
      pdfService.generatePDF.mockRejectedValue(new Error('Erreur PDF'));
      
      const response = await request(app).get('/api/cvs/1/pdf');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});
