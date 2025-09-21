const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');
const searchService = require('../services/searchService');
const pdfService = require('../services/pdfService');

router.get('/cvs', (req, res) => {
  try {
    const cvs = dataService.getAllCVs();
    res.json(cvs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/cvs/:id', (req, res) => {
  try {
    debugger;
    const cv = dataService.getCVById(parseInt(req.params.id));
    if (cv) {
      res.json(cv);
    } else {
      res.status(404).json({ error: 'CV non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/cvs', (req, res) => {
  try {
    const newCV = dataService.createCV(req.body);
    res.status(201).json(newCV);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/search/name/:name', (req, res) => {
  try {
    const results = searchService.searchByName(req.params.name);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search/technology/:tech', (req, res) => {
  try {
    const results = searchService.searchByTechnology(req.params.tech);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search/experience/:years', (req, res) => {
  try {
    const results = searchService.searchByExperience(parseInt(req.params.years));
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/cvs/:id/pdf', async (req, res) => {
  try {
    const cv = dataService.getCVById(parseInt(req.params.id));
    if (!cv) {
      return res.status(404).json({ error: 'CV non trouvé' });
    }
    
    const pdfBuffer = await pdfService.generatePDF(cv);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=cv_${cv.id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
