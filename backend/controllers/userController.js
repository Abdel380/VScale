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
    console.log("Request of user creation in the backend - START");
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

        console.log("Request of user auth Token processing ...");
        try {
            const response = await axios.post(`http://localhost:3000/api/getAuthToken`);
            p_auth_token = response.data.auth_token;
            p_user_id = response.data.id_user;
            console.log("Recovery of auth Token OK");
            console.log("auth_token : ", p_auth_token);
            console.log("user_id", p_user_id);
        } catch (error) {
            console.error('Erreur lors de l\'appel à /api/getAuthToken:', error.message);
            return res.status(500).json({ message: 'Erreur interne lors de la génération du token.' });
        }

        console.log("Recovery of code processing ...")
        try {
            console.log("Token", p_auth_token);
            const response = await axios.get(`http://localhost:3000/api/getCode`, {
                headers: {
                    Authorization : `Bearer ${p_auth_token}`
                }
            });
            const codeJSON = response.data;
            p_code = codeJSON.code;
            console.log("Recovery of code OK")
            console.log(p_code);
        } catch(error){
            console.error('Erreur lors de l\'appel à /api/getCode:', error.message);
            return res.status(500).json({ message: 'Erreur interne lors de la génération du code.' });
        }


        /*console.log("Recovery of accessToken processing ...")
        try {
            const response = await axios.get(`http://localhost:3000/api/getAccessToken`, {
                params: {
                    code: `${p_code}` // Transmettre le paramètre dans `params`
                }
            });
            p_access_token = response.data.access_token;
            console.log("Recovery of accessToken OK");
        } catch (error){
            console.log("Recovery of accessToken not working");
            return res.status(500).json({ message: 'Erreur interne lors de la reccuperation de l\'access token.' });
        }*/

        // Créer un nouvel utilisateur
        console.log("User creation");
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
        console.log("User created");
        res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.', error: error.message });
    }
};

/**
 * Fonction pour connecter un utilisateur
 */
exports.loginUser = async (req, res) => {
    console.log('Verfication utilisateur');
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        console.log('User is in the dataset');


        // Vérifier le mot de passe
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        console.log('Password valid');


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
    console.log("arrivé à userController");
    console.log(req.body);

    // Récupérer les données envoyées dans le corps de la requête
    const { p_auth_token, p_user_id } = req.body;

    // Vérifiez si les deux champs nécessaires sont présents
    if (!p_auth_token || !p_user_id) {
        return res.status(400).json({ error: "Les champs p_access_token et p_user_id sont obligatoires." });
    }

    console.log("p_auth_token récupéré :", p_auth_token);
    console.log("p_user_id récupéré :", p_user_id);
    const response = await axios.post(`http://localhost:3000/api/actualizeAccount`, {p_user_id}, {
        headers: {
            Authorization : `Bearer ${p_auth_token}`
        }
    });
    return res.status(200).json(response.data);
}


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

        const token = user.p_auth_token;

        // Appel à l'API externe pour récupérer le code
        const response = await axios.get(`http://localhost:3000/api/getCode`, {
            headers: {
                Authorization: `Bearer ${token}`
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







/**
 * Fonction pour mettre à jour les champs p_access_token, p_temp_token et p_user_id
 */
exports.createUserPowensInfo = async (req, res) => {
    const { id } = req.params;
    const { p_access_token, p_temp_token, p_user_id } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Mettre à jour les champs liés à l'API
        user.p_access_token = p_access_token || user.p_access_token;
        user.p_temp_token = p_temp_token || user.p_temp_token;
        user.p_user_id = p_user_id || user.p_user_id;

        await user.save();
        res.status(200).json({ message: 'Données API mises à jour avec succès.', user });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour des données API.', error: error.message });
    }
};
