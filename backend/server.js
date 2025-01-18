const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Pour MongoDB
const axios = require('axios'); // Pour appeler l'API externe

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// **2. Connexion à MongoDB**
mongoose
    .connect('mongodb://localhost:27017/tscale', { // Remplacez `yourDatabaseName` par le nom de votre base de données
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch((err) => {
        console.error('Erreur de connexion à MongoDB :', err.message);
        process.exit(1); // Arrête le serveur en cas d'erreur
    });


const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);



app.listen(port, () => {
    console.log(`Backend actif sur http://localhost:${port}`);
});
