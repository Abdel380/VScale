import axios from 'axios';

// Configuration d'axios
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Base URL du backend
    headers: {
        'Content-Type': 'application/json',
      },
});

// Fonction pour obtenir des données
export const fetchCode = async (token) => {
    try {
        const response = await api.get('/fetchCode', {
            headers: { 
                Authorization: `Bearer ${token}`
            },
        });
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;
    }
};

// Fonction pour envoyer des données
export const getAuthToken = async () => {
    try {
        const response = await api.post('/getAuthToken');
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données:', error);
        throw error;
    }
};

export const linkAccount = async (token) => {
    try {
        console.log("Envoie du link account");
        console.log(token);
        const reponse = await api.post('/linkAccout', {}, {
            headers: { 
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Erreur lors du link d\'un compte:', error);
    }
};


// Fonction pour enregistrer un utilisateur
export const registerUser = async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
};
  
// Fonction pour connecter un utilisateur
export const loginUser = async (loginData) => {
    const response = await api.post('/users/login', loginData);
    console.log(response);
    return response.data;
};


export const getUserCode = async (idUser) => {
    console.log("getUsercode lancé");
    const response = await api.post('/users/getUserCode', {idUser});
    return response.data.code;
}


export const accountActualizer = async (p_auth_token, p_user_id) => {
    const response = await api.post('/users/actualizeAccount', {p_auth_token, p_user_id});
    return response.data;
}

export const getAccount = async (sessionToken, p_user_id, id_account, type_account) => {
    const response = await api.post('/users/getAccount', {sessionToken, p_user_id, id_account, type_account});
    return response.data;
}

export const getCurveData = async (sessionToken, p_user_id, id_account) => {
    const response = await api.post('/users/getCurveData', {sessionToken, p_user_id, id_account});
    return response.data;
}

export const getTransactions = async (sessionToken, p_user_id, id_account) => {
    console.log("Get Transactions processing ...")
    const response = await api.post('/users/getTransactions', {sessionToken, p_user_id, id_account});
    return response.data;
}


// GOAL PART
export const createGoal = async (sessionToken, p_user_id, goalData) => {
    console.log("Create Goal processing ...")
    const response = await api.post('/goals/', {sessionToken, p_user_id, goalData});
    return response.data;
}

export const getGoals = async ( id_user ) => {
    console.log("Create Goal processing ...")
    const response = await api.get('/goals/', {
        params: { id_user }, // Passe id_user comme paramètre de requête
      });
    return response.data;
}
