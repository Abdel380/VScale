<template>
  <div>
      <!-- Affichage des informations générales -->
      <div v-if="!loading && account" id="account-courant">
          <h1>Compte : {{ account.label }}</h1>
          <p>Solde actuel : {{ account.balance }} €</p>
  
          <div class="part-1">
              <!-- Liste des transactions récentes -->
              <ul>
                  <h2>Transactions récentes</h2>
                  <div class="pie-chart">
                      <h2>Répartition des investissements</h2>
                      <CurveChart :data="balanceHistoryData" />
                  </div>
                  <p>Balance history : {{ balanceHistoryData }}</p>
                  <!--<pre>{{ formattedTransactions }}</pre>
                  <li v-for="transaction in account.transactions" :key="transaction.id">
                      <div class="transaction">
                          <p>{{ transaction.date }} - {{ transaction.label }}</p>
                          <p :class="{'positive': transaction.amount > 0, 'negative': transaction.amount < 0}">
                              {{ transaction.amount }} €
                          </p>
                      </div>
                  </li>-->
              </ul>
          </div>
  
          <div class="part-2">
              <!-- Diagramme de répartition des dépenses -->
              
  
              <!-- Statistiques -->
              
          </div>
      </div>
  
      <!-- Message de chargement -->
      <div v-else>
          <p>Chargement des données...</p>
      </div>
  </div>
  </template>
  
  <script>
  import session from "@mathieuc/tradingview/src/chart/session";
import { getAccount, getTransactions, getCurveData } from "../../services/api";
  import PieChart from "./components/PieChart.vue";
  import CurveChart from "./components/CurveChart.vue";
  
  export default {
      components: {
          PieChart,
          CurveChart
      },
      computed: {
          accountId() {
              return this.$route.params.id;
          },
          formattedTransactions() {
            return JSON.stringify(this.transactions, null, 2);
          }          
      },
      data() {
          return {
              account: null, // Données du compte courant
              loading: true, // Indique si les données sont en cours de chargement
              balance: null,
              balanceHistoryData: null,
              transactions: null,
          };
      },
      async mounted() {
          const user = JSON.parse(localStorage.getItem("user"));
          const sessionToken = localStorage.getItem("sessionToken");
  
          try {
              // Récupérer les données du compte courant via l'API
              const account = await getAccount(sessionToken, user.p_user_id, this.accountId, 1);
              this.transactions = await getTransactions(sessionToken, user.p_user_id, this.accountId);
              this.balanceHistoryData = await getCurveData(sessionToken, user.p_user_id, this.accountId);
              console.log(account)
              this.account = account;
          } catch (error) {
              console.error("Erreur lors de la récupération du compte courant :", error);
          } finally {
              this.loading = false;
          }
      },
  };
  </script>
  
  <style scoped>
  #account-courant {
      display: flex;
      flex-direction: column;
      margin: 20px;
  }
  
  .part-1, .part-2 {
      margin-top: 20px;
  }
  
  .transaction {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      border-bottom: 1px solid #ccc;
  }
  
  .positive {
      color: green;
  }
  
  .negative {
      color: red;
  }
  
  .pie-chart {
      margin: 20px 0;
  }
  
  .statistics {
      margin: 20px 0;
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
  