const Rendu = require('../models/Rendu');
const Apprenant = require('../models/Apprenant');
const axios = require('axios');


exports.creerRendu = async (req, res) => {
  try {
    const { briefId, apprenantId, lien } = req.body;

    const rendu = await Rendu.create({ briefId, apprenantId, lien });

    res.status(201).json({ success: true, data: rendu });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création du rendu' });
  }
};


exports.listerRendus = async (req, res) => {
  try {
    const rendus = await Rendu.find().populate('apprenantId', 'nom email');
    res.json({ success: true, data: rendus });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des rendus' });
  }
};

//nchof les rendus d’un apprenant
exports.rendusParApprenant = async (req, res) => {
  try {
    const { apprenantId } = req.params;
    const rendus = await Rendu.find({ apprenantId }).populate('apprenantId');
    res.json({ success: true, data: rendus });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des rendus' });
  }
};

// njib les compétences attendues pour un rendu
exports.getCompetencesDuBrief = async (req, res) => {
  try {
    const { id } = req.params;
    const rendu = await Rendu.findById(id);

    if (!rendu) {
      return res.status(404).json({ success: false, message: 'Rendu non trouvé' });
    }

    // get brief-service pour récupérer le brief et ses compétences
    const briefResponse = await axios.get(`${process.env.BRIEF_SERVICE_URL}/briefs/${rendu.briefId}`);
    const brief = briefResponse.data;

    res.json({ success: true, competences: brief.competences });
  } catch (error) {
    console.error('Erreur de communication avec brief-service:', error.message);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des compétences' });
  }
};
