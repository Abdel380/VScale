<template>
  <div>
    <h2>Bienvenue dans votre tableau de bord, {{ firstname }}</h2>
    <button @click="logout">Déconnexion</button>
    <button @click="addAccount">Ajouter un compte</button>

    <!-- Afficher un message de chargement tant que les données ne sont pas prêtes -->
    <div v-if="loading">
      <p>Chargement de vos comptes bancaires...</p>
    </div>

    <!-- Afficher les comptes une fois chargés -->
    <div v-else>
      <p>Solde total : {{ balance }}</p>
      <p>Nombre total de comptes : {{ totalAccounts }}</p>
      <div v-if="accounts">
        <h3>Vos comptes bancaires :</h3>
        <div class="account-list">
          <AccountCard v-for="account in accounts" :key="account.id" :account="account" />
        </div>
      </div>
      <p v-else>Aucun compte bancaire trouvé.</p>
    </div>

    <p>{{ goals }}</p>
    <!-- Formulaire pour ajouter un nouvel objectif -->
      <div>
        <h3>Créer un nouvel objectif</h3>
        <form @submit.prevent="submitGoal">
          <div>
            <label for="name">Nom de l'objectif :</label>
            <input type="text" id="name" v-model="goalForm.name" required />
          </div>
          <div>
            <label for="targetAmount">Montant cible :</label>
            <input type="number" id="targetAmount" v-model="goalForm.targetAmount" required />
          </div>
          <div>
            <label for="accountIds">IDs des comptes (séparés par des virgules) :</label>
            <input type="text" id="accountIds" v-model="goalForm.accountIds" />
          </div>
          <button type="submit">Créer l'objectif</button>
        </form>
      </div>
    
  </div>
</template>

<script>
import { accountActualizer, getUserCode, createGoal, getGoals } from "../../services/api";
import AccountCard from "../../components/CardAccount.vue";

export default {
  components: {
    AccountCard,
  },
  data() {
    return {
      firstname: "",
      lastname: "",
      link: "https://webview.powens.com/fr/connect?domain=tscale-sandbox.biapi.pro&client_id=38585586&redirect_uri=http://localhost:5173/&code=",
      accounts: null,         // Contient les données des comptes
      balance: null,
      totalAccounts: null,
      loading: true,          // Indique si les données sont en cours de chargement
      goalForm: {             // Ajout de l'initialisation de goalForm
        name: "",
        targetAmount: "",
        accountIds: "",
      },
      goals: null,
    };
  },
  async mounted() {
    // Récupérer les données utilisateur depuis localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      this.firstname = user.firstname || "";
      this.lastname = user.lastname || "";
    }

    try {
      // Récupérer les comptes depuis l'API et les stocker dans le localStorage
      const accountsData = await accountActualizer(user.p_auth_token, user.p_user_id);
      this.accounts = accountsData.accounts;
      this.balance = accountsData.balance;
      this.totalAccounts = accountsData.total;

      this.goals = await getGoals(user.idUser);

      localStorage.setItem("accounts", JSON.stringify(this.accounts));
    } catch (error) {
      console.error("Erreur lors de la récupération des comptes :", error);
    } finally {
      // Arrêter le chargement une fois que les données sont prêtes
      this.loading = false;
    }
  },
  methods: {
    logout() {
      // Supprimer le token de session
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("user");
      this.$router.push("/login"); // Rediriger vers la page de connexion
    },
    async addAccount() {
      const user = JSON.parse(localStorage.getItem("user"));
      const p_code = await getUserCode(user.idUser);
      const url = this.link + p_code;
      window.location.replace(url);
    },
    async submitGoal() {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.p_auth_token) {
        alert("Veuillez vous reconnecter.");
        return;
      }

      try {
        // Préparer les données du formulaire
        const goalData = {
          name: this.goalForm.name,
          targetAmount: parseFloat(this.goalForm.targetAmount),
          accountIds: this.goalForm.accountIds.split(",").map((id) => id.trim()), // Convertir en tableau
          user: user.idUser
        };

        // Envoyer la requête à l'API
        const response = await createGoal(user.p_auth_token, user.idUser, goalData);
        alert("Objectif créé avec succès : " + response.goal.name);

        // Réinitialiser le formulaire après succès
        this.goalForm = {
          name: "",
          targetAmount: "",
          accountIds: "",
        };
      } catch (error) {
        console.error("Erreur lors de la création de l'objectif :", error);
        alert("Erreur : " + error.message);
      }
    },
  },
};
</script>

<style>
.account-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
