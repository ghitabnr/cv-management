const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

router.get('/', (req, res) => {
  const cvs = dataService.getAllCVs();
  res.render('index.html', { cvs });
});

router.get('/cv/:id', (req, res) => {
  try {
    debugger;
    const cv = dataService.getCVById(parseInt(req.params.id));
    if (cv) {
      res.render('cv-detail.html', { cv });
    } else {
      res.status(404).render('404.html');
    }
  } catch (error) {
    res.status(500).render('error.html', { error: error.message });
  }
});

router.get('/search', (req, res) => {
  res.render('search.html');
});

module.exports = router;
