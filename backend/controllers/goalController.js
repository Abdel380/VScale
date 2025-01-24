const Goal = require('../models/Goal');
const User = require('../models/User');

// Créer un nouvel objectif
exports.createGoal = async (req, res) => {
  try {
    const { name, targetAmount, accountIds, user } = req.body.goalData;
    const goal = new Goal({
      user, // Assurez-vous que l'utilisateur est authentifié
      name,
      targetAmount,
      accountIds
    });

    await goal.save();
    res.status(201).json({ message: 'Objectif créé avec succès', goal });
  } catch (err) {
    console.error("Erreur lors de la sauvegarde de l'objectif :", err);
    res.status(500).json({ message: 'Erreur lors de la création de l\'objectif', error: err.message });  }
};

// Récupérer les objectifs de l'utilisateur
exports.getGoals = async (req, res) => {
    try {
      const { id_user } = req.query; // Récupérer l'ID utilisateur depuis les paramètres de requête
  
      // Trouver l'utilisateur dans la base de données
      const user = await User.findOne({ idUser: id_user });
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      // Trouver tous les objectifs de l'utilisateur
      const goals = await Goal.find({ user: id_user });
  
      // Parcourir chaque objectif et calculer la somme des soldes des comptes associés
      const goalsWithBalance = await Promise.all(goals.map(async (goal) => {
        // Extraire les ID des comptes associés à cet objectif
        const accountIds = goal.accountIds;
  
        // Récupérer les informations des comptes à partir de user.accountList
        const accounts = user.accountList.filter(account => accountIds.includes(account.id_account));
  
        // Calculer la somme des soldes des comptes associés à cet objectif
        const totalBalance = accounts.reduce((acc, account) => acc + account.solde, 0);
  
        // Ajouter la somme des soldes à l'objet goal
        return {
          ...goal.toObject(),
          totalBalance, // Ajoute le solde total à l'objectif
        };
      }));
  
      // Retourner les objectifs avec la somme des soldes
      res.status(200).json({ goals: goalsWithBalance });
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la récupération des objectifs', error: err.message });
    }
};
  
  

// Mettre à jour un objectif
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: id, user: req.user.id },
      updates,
      { new: true }
    );

    if (!goal) return res.status(404).json({ message: 'Objectif non trouvé' });
    res.status(200).json({ message: 'Objectif mis à jour', goal });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err.message });
  }
};

// Supprimer un objectif
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findOneAndDelete({ _id: id, user: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Objectif non trouvé' });

    res.status(200).json({ message: 'Objectif supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: err.message });
  }
};
