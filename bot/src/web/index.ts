require('dotenv').config();

import path from 'path';
import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { onboardUser } from './discord';
import { verifyIdToken } from './google';
import { googleClientId, hostedDomain, secretkey } from '../config';

const app = express()
const port = parseInt(process.env.PORT) || 3000

app.use(express.static(path.join(__dirname, 'web')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(express.urlencoded());

app.get('/discord/verify', (req, res) => {
    const token = req.query.token as string;
    try {
        jsonwebtoken.verify(token, secretkey) as any;
        res.render('verify', { clientId: googleClientId, domain: hostedDomain, token });   
    } catch (e) {
        console.log(e);
        res.render('error', { error: e.message });
    }
});

app.post('/discord/verify', (req, res) => {
    const { jwt, idToken } = req.body;
    const { userId, guildId } = jsonwebtoken.verify(jwt, secretkey) as any;

    verifyIdToken(idToken)
        .then(({ name, email }) => {
            const assignedNickname = name.replace(/[^a-zA-Z ]/gi, '').trim();
            if (!checkMemberEligibility(email)) {
                throw new Error("Ineligible account");
            };

            return onboardUser(guildId, userId, assignedNickname);
        })
        .then(() => {
            res.render('ok');
        })
        .catch(e => {
            console.log(e);
            res.render('error', { error: e.message });
        });
});

app.listen(port, () => console.log(`HMIF Bot Discord Web listening at port ${port}`))


function checkMemberEligibility(email: string) {
    const allowedPrefixes = ['135', '182'];
    const nim = email.split('@')[0];
    const nimPrefix = nim.substring(0, 3);
    return allowedPrefixes.includes(nimPrefix);
}