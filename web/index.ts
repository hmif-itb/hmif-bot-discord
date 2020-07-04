require('dotenv').config();

import path from 'path';
import express from 'express';
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'web')));
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs')
app.get('/discord/verify', (req, res) => {
    const clientId = process.env.CLIENT_ID;
    const domain = process.env.HOSTED_DOMAIN;
    res.render('verify', { clientId, domain });
})

app.listen(port, () => console.log(`HMIF Bot Discord Web listening at port ${port}`))