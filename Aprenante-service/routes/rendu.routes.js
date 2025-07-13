const express = require('express');
const router = express.Router();
const {
  creerRendu,
  listerRendus,
  rendusParApprenant,
  getCompetencesDuBrief
} = require('../controllers/rendu.controller');

router.post('/', creerRendu);

router.get('/', listerRendus);

router.get('/apprenant/:apprenantId', rendusParApprenant);

router.get('/:id/competences', getCompetencesDuBrief);

module.exports = router;
