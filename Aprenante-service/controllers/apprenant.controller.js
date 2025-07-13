const Apprenant = require('../models/Apprenant');


exports.creerApprenant = async (req, res) => {
  try {
    const { nom, email } = req.body;
    const existe = await Apprenant.findOne({ email });
    if (existe) {
      return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
    }
    const apprenant = await Apprenant.create({ nom, email });
    res.status(201).json({ success: true, data: apprenant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création de l\'apprenant' });
  }
};


exports.listerApprenants = async (req, res) => {
  try {
    const apprenants = await Apprenant.find();
    res.json({ success: true, data: apprenants });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des apprenants' });
  }
};


exports.getApprenantById = async (req, res) => {
  try {
    const apprenant = await Apprenant.findById(req.params.id);
    if (!apprenant) {
      return res.status(404).json({ success: false, message: 'Apprenant non trouvé' });
    }
    res.json({ success: true, data: apprenant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération de l\'apprenant' });
  }
};


exports.modifierApprenant = async (req, res) => {
  try {
    const { nom, email } = req.body;
    const apprenant = await Apprenant.findByIdAndUpdate(
      req.params.id,
      { nom, email },
      { new: true, runValidators: true }
    );
    if (!apprenant) {
      return res.status(404).json({ success: false, message: 'Apprenant non trouvé' });
    }
    res.json({ success: true, data: apprenant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour de l\'apprenant' });
  }
};

exports.supprimerApprenant = async (req, res) => {
  try {
    const apprenant = await Apprenant.findByIdAndDelete(req.params.id);
    if (!apprenant) {
      return res.status(404).json({ success: false, message: 'Apprenant non trouvé' });
    }
    res.json({ success: true, message: 'Apprenant supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression de l\'apprenant' });
  }
};
