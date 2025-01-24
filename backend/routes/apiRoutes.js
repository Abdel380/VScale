const express = require('express');
const router = express.Router();
const axios = require('axios');
const domain = "tscale-sandbox";
const port = 3000;


router.post('/getAuthToken', async (req, res) => {
        try {
        // Appel à une API externe avec POST
        const response = await axios.post(`https://${domain}.biapi.pro/2.0/auth/init`, {
            client_id: '38585586',
            client_secret: '3IFGQgqwTp2tEAeVcSw5JiWgIBRD9k0q'
        });


        res.status(200).json(response.data);
    } catch (error) {
        console.error('Erreur lors de la requête externe :', error.message);
        res.status(500).json({ error: 'Erreur lors de la communication avec l\'API externe' });
    }
});


router.get('/getCode', async (req, res) => {
    try {
        // Appel vers une API externe
        const p_auth_token = req.headers.authorization?.split(' ')[1]; 
        const response = await axios.get(`https://${domain}.biapi.pro/2.0/auth/token/code`, 
            {
                headers: { 
                  Authorization: `Bearer ${p_auth_token}`
                }
            }
        );
        return res.status(200).json(response.data);

    } catch (error) {
        console.error('Erreur lors de la requête externe :', error.message);
        res.status(500).json({ error: 'Erreur lors de la communication avec l\'API externe' });
    }
});


router.get('/getAccessToken', async (req, res) => {
    // code recovery
    const { code } = req.query; // Récupérer le paramètre `code`
    if (!code) {
        return res.status(400).json({ message: 'Code manquant.' });
    }
    try {
        // Effectuer l'appel API avec les données dans le corps
        const response = await axios.post(`https://${domain}.biapi.pro/2.0/auth/token/access`, 
            {
                client_id: "38585586",
                client_secret: "3IFGQgqwTp2tEAeVcSw5JiWgIBRD9k0q",
                code: code
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error(`Erreur lors de la requête à l'API https://${domain}.biapi.pro/2.0/auth/token/access`, error.message);
        res.status(500).json({ error: "Erreur lors de la récupération de l'access token." });
    }
});

router.post('/actualizeAccount', async (req, res) => { // Returning a list of account element
    const p_auth_token = req.headers.authorization; // Supprime "Bearer " et récupère le token
    if (!p_auth_token) {
        return res.status(401).json({ error: 'Token manquant dans les en-têtes' });
    }

    try {
        const response = await axios.get(`https://${domain}.biapi.pro/2.0/users/me/accounts`, 
            {
                headers: { 
                Authorization: p_auth_token
                }
            }
        );
        res.status(200).json(response.data);
    }catch (error) {
        console.error('Erreur lors de la récupération des comptes :', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des comptes' });
    }
});



router.post('/getAccountPEA', async (req, res) => { // Returning a list of account element
    const p_auth_token = req.headers.authorization; // Supprime "Bearer " et récupère le token
    if (!p_auth_token) {
        return res.status(401).json({ error: 'Token manquant dans les en-têtes' });
    }

    const { id_account } = req.body;
    try {
        const response = await axios.get(`https://${domain}.biapi.pro/2.0/users/me/accounts/${id_account}/investments`, 
            {
                headers: { 
                Authorization: p_auth_token
                }
            }
        );
        res.status(200).json(response.data);
    }catch (error) {
        console.error('Erreur lors de la récupération des comptes :', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des comptes' });
    }
});
router.post('/getAccount', async (req, res) => { // Returning a list of account element
    const p_auth_token = req.headers.authorization; // Supprime "Bearer " et récupère le token
    if (!p_auth_token) {
        return res.status(401).json({ error: 'Token manquant dans les en-têtes' });
    }

    const { id_account } = req.body;
    try {
        const response = await axios.get(`https://${domain}.biapi.pro/2.0/users/me/accounts/${id_account}`, 
            {
                headers: { 
                Authorization: p_auth_token
                }
            }
        );
        res.status(200).json(response.data);
    }catch (error) {
        console.error('Erreur lors de la récupération des comptes :', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des comptes' });
    }
});


router.post('/getTransactions', async (req, res) => { // Returning a list of account element
    const p_auth_token = req.headers.authorization; // Supprime "Bearer " et récupère le token
    if (!p_auth_token) {
        return res.status(401).json({ error: 'Token manquant dans les en-têtes' });
    }

    const { id_account } = req.body;
    try {
        const response = await axios.get(`https://${domain}.biapi.pro/2.0/users/me/accounts/${id_account}/transactions?expand=categories&limit=1000&min_date=2024-12-01`, 
            {
                headers: { 
                Authorization: p_auth_token
                }
            }
        );

        res.status(200).json(response.data);
    }catch (error) {
        console.error('Erreur lors de la récupération des comptes :', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des comptes' });
    }
});

router.post('/getCurveData', async (req, res) => { // Returning a list of account element
    const p_auth_token = req.headers.authorization; // Supprime "Bearer " et récupère le token
    if (!p_auth_token) {
        return res.status(401).json({ error: 'Token manquant dans les en-têtes' });
    }

    const { id_account } = req.body;

    try {
        const response = await axios.get(`https://${domain}.biapi.pro/2.0/users/me/accounts/${id_account}/balances?min_date=2023-01-01`, 
            {
                headers: { 
                Authorization: p_auth_token
                }
            }
        );
        res.status(200).json(response.data);
    }catch (error) {
        console.error('Erreur lors de la récupération des données pour la courbe :', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des données pour la courbe' });
    }
});

module.exports = router;