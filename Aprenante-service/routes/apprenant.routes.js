const express = require('express');
const router = express.Router();
const {
  creerApprenant,
  listerApprenants,
  getApprenantById,
  modifierApprenant,
  supprimerApprenant
} = require('../controllers/apprenant.controller');

router.post('/', creerApprenant);

router.get('/', listerApprenants);


router.get('/:id', getApprenantById);


router.put('/:id', modifierApprenant);

router.delete('/:id', supprimerApprenant);

module.exports = router;
