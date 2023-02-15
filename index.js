//We are using express. Impot the module and configure it to run on Port3000
var express = require('express');
const app = express();
const port = 3000;
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
app.use(express.json());

const firebaseConfig = {
  "type": "service_account",
  "project_id": "boilertime-23f2f",
  "private_key_id": "b1c7a2c1704e87e114f8245917a52fa6c1195b7c",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCrl4Iz3pnFd0MO\nEAxe3xXvsN7UK/T/T6fIzIGqpBXw7nqo7NZlng08Xl/e2au66hj0wa1JZSpSk92K\n6cDyoIJW5kcLxGaVoxb8KdNhg8mfwB2WvBCRKBzVodZxed3xcgnMRebntoRZf5PD\nc1viyzXzVAEoc+qgLM1kfGkKeCnktvEi2Ao/3FxJtpxRCwjRATcKYN4oSz0TDeA/\nxJ+PK1AGVGFYi+yJTMpjxk8y01t+YB3m/axvMCt9zTBZL1a2kPPR9Qf7nUIzlMif\njU6vqgx6OBsQ9JeMLWHpq9kKy7tiFdHU3u3aCpxSc9g8FjI8oNC8JM1hNLT75m3d\nh5ShooCpAgMBAAECggEACRkFnX/sKcDWxJBbw4zy8gwv6FJzUTUVOYuERXqhMi7G\nwJ2cCXO9kmmTjjJ+zTB7xcBeEnHjclDmMmcN5J9XgcmAU1KkuMLWpWSHUViGMGrk\ndrk+bJ/SlY4Y21fhiVtpQxQit77g2gjuWfLMGKR7Fg1qaU1qD3eIpU8GV7iCyh5F\nteKB9GMAWJODVlauQzZw24bZQ7t+Wr66YzO6bmeatFEAaEG4J1qbIz9QGPDChxvE\nb7gyK8Ni7yf6ANIWU3i9rPuJ2TlnUDZKZYJMARwiLjW8QQCblj/2fUHt1QOuwehj\n9QJnG57Zpo9hlJdX8F+U0jlDuHC/X+YIed/nh+oyjQKBgQDhxPO6v4siITpHGPC0\nNrZZQho0YrQjQosn7wHldyF2WYi30eLTiW2/YK9V1B1nsfqbQga9BE0fYbV8qBhc\nnqTdEusjYqZF0htS2/7ytgfmS6POWuNyDIFFNVzt2HoG7a02OOSZUyB8VdyvqRBZ\nFBAcSq1lDPXw0KxYzutpszEmjQKBgQDCkW3tfDtKuqp/ClAa9drNbdNXYScu3icY\nnO5xXhTuJNUvwpXWocUcOdClGssi1K57Qm8NCaHsTDVhhd+B+0IJnaFE9nBhSabM\ncCkvWo9u0WflJPUDxC+RAGIRRZ7p/avmorYByfrPhcBZvE30cFdMVlkTg8kyFIq/\nGrOQ9x6ZjQKBgQC4s9hyP6IkGesDn3PM+7XS8DFgCiA1eIs/8Fks0XmeyUEAocVg\nKl6O4xqOrSohW4oa2rmIiaxOsDE5+otzupZGBuQ33s0I8gtIjpLVHfb4gYlRmSna\ndECNzkpoi2HJqUi7w2/BwDAjiFszmqy1M6S6gJ26vg+3JADb5uzRXLgpQQKBgQCJ\nrSqiD3RNLsUSXBPO4AVRs9MGU6LMUTpM+k7nPXGGCd4oi4JHe/TkQizXh5wSK3jD\nk4DNMvG3KT3kojxD160k7Lt+9vsSfHFg3EToUyaHffoMdRhC8AHQkvrRyffnDy8i\nZiRwI6IsUjKHzO1EeHHtfHRPkMM/grWjAJvrilHGyQKBgQDHbJh8JqpUPrzXK7Mc\nRei9knHLbMpJoZigjAsdKPsRZotuCnWYkEctlAVcxPnMVPH1TH9QF4SricMFbFHX\nQ6afDsZ0Ghu1aiXjOLGl4/fogWnOWOPWYlhHU8U1ZqY2jCWiCSw+l8Hs3EDGnIVh\neYHbfwJloDXFdlyipzyJFnYytQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-3qobl@boilertime-23f2f.iam.gserviceaccount.com",
  "client_id": "112009824511537079852",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3qobl%40boilertime-23f2f.iam.gserviceaccount.com"
};





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
  console.log(db.collection('user_profile').doc('test_user'));
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
