//We are using express. Impot the module and configure it to run on Port3000
var express = require('express');
const app = express();
const port = 3000;
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
app.use(express.json());


initializeApp({
  // add your own config.json file
  credential: cert('./database/config.json')
});

const db = getFirestore();

//Route for /api. Add new event listeners as needed for new routes. 
app.get('/api', (req, res) => {
  res.send('API live!')
})

app.post('/api/login', (req, res) => {
  console.log(req);
  console.log('\n\n\n\n Now printing body \n\n\n\n');
  console.log(req.body);
  console.log(db.collection('user_profile').doc('test_user').toString());
  /*
  const cityRef = db.collection('').doc('SF');
  const doc = await cityRef.get();
  if (!doc.exists) {
      console.log('No such document!');
  } else {
      console.log('Document data:', doc.data());
  }
  */
  res.send('The user name of this user is ' + req.body.username);
});

app.listen(port, () => {
  console.log(`BoilerTime live on Port: ${port}`)
})
