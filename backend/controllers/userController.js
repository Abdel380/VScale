const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Pour appeler l'API externe
const { json } = require('sequelize');
const port = 3000;

const SECRET_KEY = "kjsd87*29!dhfs82JHFSdfh!328dh@43*dfhh_93";
/**
 * Fonction pour créer un utilisateur
 */
exports.createUser = async (req, res) => {
    const { firstname, lastname, email, password, dateOfBirth } = req.body;

    let p_auth_token;
    let p_user_id;
    let p_access_token;
    let p_code;
    
    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
        }

        try {
            const response = await axios.post(`http://localhost:3000/api/getAuthToken`);
            p_auth_token = response.data.auth_token;
            p_user_id = response.data.id_user;
        } catch (error) {
            console.error('Erreur lors de l\'appel à /api/getAuthToken:', error.message);
            return res.status(500).json({ message: 'Erreur interne lors de la génération du token.' });
        }

        try {
            const response = await axios.get(`http://localhost:3000/api/getCode`, {
                headers: {
                    Authorization : `Bearer ${p_auth_token}`
                }
            });
            const codeJSON = response.data;
            p_code = codeJSON.code;

        } catch(error){
            console.error('Erreur lors de l\'appel à /api/getCode:', error.message);
            return res.status(500).json({ message: 'Erreur interne lors de la génération du code.' });
        }
        
        // Créer un nouvel utilisateur
        countIdList = [];
        const newUser = new User({
            firstname,
            lastname,
            email,
            password,
            dateOfBirth,
            p_auth_token,
            p_user_id,
            p_code,
            countIdList
        });

        await newUser.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.', error: error.message });
    }
};

/**
 * Fonction pour connecter un utilisateur
 */
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        // Générer un token de session
        const sessionToken = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '2h' });
        user.sessionToken = sessionToken;
        await user.save();
        

        const sessionUser = {
            lastname : user.lastname,
            firstname : user.firstname,
            email: user.email,
            sessionToken: sessionToken,
            p_code: user.p_code,
            p_auth_token: user.p_auth_token,
            p_user_id: user.p_user_id,
            idUser: user.idUser
        }

        return res.status(200).json({ message: 'Connexion réussie.', sessionUser });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion.', error: error.message });
    }
};



exports.accountActualizer = async (req, res) => {
  try {
    // Récupérer les données envoyées dans le corps de la requête
    const { p_auth_token, p_user_id } = req.body;

    // Vérifiez si les deux champs nécessaires sont présents
    if (!p_auth_token || !p_user_id) {
      return res.status(400).json({ error: "Les champs p_auth_token et p_user_id sont obligatoires." });
    }

    // Appeler l'API pour actualiser les comptes
    const response = await axios.post(
      `http://localhost:3000/api/actualizeAccount`,
      { p_user_id },
      {
        headers: {
          Authorization: `Bearer ${p_auth_token}`,
        },
      }
    );

    console.log("Données reçues de l'API:", response.data);

    // Extraire les comptes du JSON reçu
    const accounts = response.data.accounts.map((account) => ({
      id_account: account.id,
      solde: account.balance,
      update: account.last_update, // Assurez-vous que le format de date correspond à vos attentes
    }));

    console.log("Comptes formatés :", accounts);

    // Trouver l'utilisateur correspondant dans la base de données
    const user = await User.findOne({ p_user_id });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Mettre à jour le champ accountList de l'utilisateur
    user.accountList = accounts;

    // Sauvegarder les modifications dans la base de données
    await user.save();

    // Retourner une réponse de succès
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Erreur lors de l'actualisation des comptes :", error.message);
    return res.status(500).json({
      error: "Une erreur est survenue lors de l'actualisation des comptes.",
      details: error.message,
    });
  }
};



exports.getUserCode = async (req, res) => {
    const { idUser } = req.body;

    // Vérification de l'entrée utilisateur
    if (!idUser) {
        return res.status(400).json({ error: "Le champ idUser est obligatoire." });
    }

    try {
        // Recherche de l'utilisateur dans la base de données
        const user = await User.findOne({ idUser });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable." });
        }

        const p_auth_token = user.p_auth_token;

        // Appel à l'API externe pour récupérer le code
        const response = await axios.get(`http://localhost:3000/api/getCode`, {
            headers: {
                Authorization: `Bearer ${p_auth_token}`
            }
        });

        const codeJSON = response.data;
        const newCode = codeJSON.code;

        // Mise à jour du champ p_code de l'utilisateur
        user.p_code = newCode;
        await user.save();

        // Réponse avec succès
        res.status(200).json({code: newCode });
    } catch (error) {
        console.error("Erreur lors de la récupération ou de la mise à jour du code :", error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération ou de la mise à jour du code.', error: error.message });
    }
};





exports.getAccount = async (req, res) => {
    const { sessionToken, p_user_id, id_account, type_account } = req.body;

    if (!p_user_id || !id_account) {
        return res.status(400).json({ error: "Le champ est obligatoire." });
    }

    try {
        // Recherche de l'utilisateur dans la base de données
        const user = await User.findOne({ p_user_id });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable." });
        }

        const p_auth_token = user.p_auth_token;
        let response = null;

        // Appel à l'API externe pour récupérer le code
        if (type_account == 2){
            response = await axios.post(`http://localhost:3000/api/getAccountPEA`, {id_account},{
                headers: {
                    Authorization: `Bearer ${p_auth_token}`
                }
            });
        } else {
            response = await axios.post(`http://localhost:3000/api/getAccount`, {id_account},{
                headers: {
                    Authorization: `Bearer ${p_auth_token}`
                }
            });
        }

        // Réponse avec succès
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Erreur lors de la récupération ou de la mise à jour du code :", error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération ou de la mise à jour du code.', error: error.message });
    }

};


exports.getTransactions = async (req, res) => {
    const { sessionToken, p_user_id, id_account } = req.body;

    if (!p_user_id || !id_account) {
        return res.status(400).json({ error: "Le champ est obligatoire." });
    }

    try {
        // Recherche de l'utilisateur dans la base de données
        const user = await User.findOne({ p_user_id });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable." });
        }

        const p_auth_token = user.p_auth_token;

        // Appel à l'API externe pour récupérer les transactions
        const response = await axios.post(
            `http://localhost:3000/api/getTransactions`,
            { id_account },
            {
                headers: {
                    Authorization: `Bearer ${p_auth_token}`
                }
            }
        );

        const transactions = response.data.transactions;

        // Calcul des revenus (incomes) et dépenses (expenses)
        const incomes = transactions
            .filter(transaction => transaction.value > 0)
            .reduce((acc, transaction) => acc + transaction.value, 0);

        const expenses = transactions
            .filter(transaction => transaction.value < 0)
            .reduce((acc, transaction) => acc + transaction.value, 0);

        // Formatage des transactions
        const formattedTransactions = transactions.map(transaction => ({
            id: transaction.id,
            original_wording: transaction.original_wording,
            price: transaction.value,
            id_category: transaction.id_category,
            date: transaction.date
        }));

        // Construction de la réponse formatée
        const formatedJSON = {
            incomes,
            expenses,
            transactions: formattedTransactions
        };

        // Réponse avec succès
        res.status(200).json(formatedJSON);
    } catch (error) {
        console.error("Erreur lors de la récupération ou de la mise à jour du code :", error.message);
        res.status(500).json({
            message: 'Erreur lors de la récupération ou de la mise à jour du code.',
            error: error.message
        });
    }
};



exports.getCurveData = async (req, res) => {
    const { sessionToken, p_user_id, id_account } = req.body;

    if (!p_user_id) {
        return res.status(400).json({ error: "Le champ est obligatoire." });
    }

    try {
        // Recherche de l'utilisateur dans la base de données
        const user = await User.findOne({ p_user_id });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable." });
        }

        const p_auth_token = user.p_auth_token;

        // Appel à l'API externe pour récupérer les données
        const response = await axios.post(`http://localhost:3000/api/getCurveData`, { id_account }, {
            headers: {
                Authorization: `Bearer ${p_auth_token}`
            }
        });

        // Transformation des données pour les simplifier
        const simplifiedData = response.data.balances.map(item => ({
            date: item.max_date,
            balance: item.balance
        }));

        // Réponse avec succès
        res.status(200).json(simplifiedData);
    } catch (error) {
        console.error("Erreur lors de la récupération ou de la mise à jour du code :", error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération ou de la mise à jour du code.', error: error.message });
    }
};