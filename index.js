const express = require('express')
const path = require('path');


const app = express();
const port = 3000;

app.use('/assets',express.static('assets')); //host static assets

app.get('/', (req, res) => {
//   res.send('Hello World!')
    res.sendFile(path.join(__dirname,"index.html"));
});

app.get('/stfcpro.htm', (req, res) => {
//   res.send('Hello World!')
    res.sendFile(path.join(__dirname,"stfcpro.htm"));
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});