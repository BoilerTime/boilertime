const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

initializeApp({
<<<<<<< Updated upstream
  credential: cert('../config.json')
=======
  credential: cert('../config.json'),
>>>>>>> Stashed changes
});