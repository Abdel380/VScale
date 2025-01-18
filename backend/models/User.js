const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { INTEGER } = require('sequelize');
const AutoIncrement = require('mongoose-sequence')(mongoose);



// Définir le schéma de l'utilisateur
const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    idUser: {
        type: Number, // Identifiant interne ou lié à votre système
    },
    p_auth_token: {
        type: String, // Champ permanent récupéré via l'API
    },
    sessionToken: {
        type: String, // Champ récupéré via l'appel à l'API
    },
    p_user_id: {
        type: Number, // Identifiant utilisateur provenant de l'API
    },
    p_code: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    countIdList: {
        type: [Number], 
        default: [],
    },
}, {
    timestamps: true,
});

// Ajouter un compteur automatique à idUser
UserSchema.plugin(AutoIncrement, { inc_field: 'idUser' }); // Utilise le champ `idUser`


// **Hash du mot de passe avant sauvegarde**
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

// **Méthode pour vérifier le mot de passe**
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);