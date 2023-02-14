//We are using express. Impot the module and configure it to run on Port3000
var express = require('express');
const app = express();
const port = 3000;

//Route for /api. Add new event listeners as needed for new routes. 
app.get('/api', (req, res) => {
  res.send('API live!')
})

app.listen(port, () => {
  console.log(`BoilerTime live on Port: ${port}`)
})
