const express = require('express');
const app = express();
const port = 3000;
const router = require('./apiRouter');

app.get('/', (req, res) => res.send('Hello World!'));

// nhom cac api lien quan den user
app.use('/api/v1', router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));