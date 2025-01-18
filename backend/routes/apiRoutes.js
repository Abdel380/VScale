const express = require('express');
const router = express.Router();
const axios = require('axios');
const domain = "tscale-sandbox";
const port = 3000;


router.post('/getAuthToken', async (req, res) => {
    console.log('getAuthToken called')
    try {
        // Appel à une API externe avec POST
        const response = await axios.post(`https://${domain}.biapi.pro/2.0/auth/init`, {
            client_id: '38585586',
            client_secret: '3IFGQgqwTp2tEAeVcSw5JiWgIBRD9k0q'
        });

        console.log(response.data)

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Erreur lors de la requête externe :', error.message);
        res.status(500).json({ error: 'Erreur lors de la communication avec l\'API externe' });
    }
});


router.get('/getCode', async (req, res) => {
    try {
        console.log("Tentative de reccuperation du code");
        // Appel vers une API externe
        const p_auth_token = req.headers.authorization?.split(' ')[1]; 
        console.log("Token reccuperer dans fetch -> Envoie de la requete à l'api Powens");
        console.log(p_auth_token);
        const response = await axios.get(`https://${domain}.biapi.pro/2.0/auth/token/code`, 
            {
                headers: { 
                  Authorization: `Bearer ${p_auth_token}`
                }
            }
        );
        //console.log("Code reccuperer avec succès");
        console.log(response.data);
        return res.status(200).json(response.data);

    } catch (error) {
        console.error('Erreur lors de la requête externe :', error.message);
        res.status(500).json({ error: 'Erreur lors de la communication avec l\'API externe' });
    }
});


router.get('/getAccessToken', async (req, res) => {
    // code recovery
    console.log('getAccessToken');
    const { code } = req.query; // Récupérer le paramètre `code`
    if (!code) {
        return res.status(400).json({ message: 'Code manquant.' });
    }
    console.log("Code reçu :", typeof code);
    try {
        // Effectuer l'appel API avec les données dans le corps
        const response = await axios.post(`https://${domain}.biapi.pro/2.0/auth/token/access`, 
            {
                client_id: "38585586",
                client_secret: "3IFGQgqwTp2tEAeVcSw5JiWgIBRD9k0q",
                code: code
            }
        );

        console.log("Access token récupéré :", response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(`Erreur lors de la requête à l'API https://${domain}.biapi.pro/2.0/auth/token/access`, error.message);
        res.status(500).json({ error: "Erreur lors de la récupération de l'access token." });
    }
});

router.post('/actualizeAccount', async (req, res) => { // Returning a list of account element
    console.log("Actualizing list of account");    
    const p_auth_token = req.headers.authorization; // Supprime "Bearer " et récupère le token
    if (!p_auth_token) {
        return res.status(401).json({ error: 'Token manquant dans les en-têtes' });
    }
    console.log("Token reccupéré avec succès : ", p_auth_token);

    try {
        const response = await axios.get(`https://${domain}.biapi.pro/2.0/users/me/accounts`, 
            {
                headers: { 
                Authorization: p_auth_token
                }
            }
        );
        console.log("Liste des comptes récupérée :", response.data);
        res.status(200).json(response.data);
    }catch (error) {
        console.error('Erreur lors de la récupération des comptes :', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des comptes' });
    }
});





module.exports = router;