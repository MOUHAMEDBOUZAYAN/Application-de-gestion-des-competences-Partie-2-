const mongoose = require('mongoose');
const app = require('./server');

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI, {

})
.then(() => {
  console.log('Connexion à MongoDB réussie');
  app.listen(PORT, () => {
    console.log(` Apprenant-Service lancé sur le port ${PORT}`);
  });
})
.catch(err => {
  console.error('Erreur de connexion MongoDB:', err.message);
  process.exit(1);
});
