<template>
<div>
    <!-- Affichage des informations générales -->
    <div v-if="!loading && account" id="account-pea">
        <h1>Compte : {{ account.label }}</h1>
        <p>Valorisation totale : {{ account.valuation }}</p>

        <div class="part-1">
            <div class="curve">
            <h2>Évolution de la valorisation</h2>
            <CurveChart :data="curveData" />
        </div>
        <!-- Liste des investissements -->
        <ul>
            <h2>Détails des investissements</h2>
            <li v-for="investment in account.investments" :key="investment.id">
            <LinePEA :investment="investment" />
            </li>
        </ul>
        </div>

        <div class="part-2">
            <!-- Diagramme en camembert -->
             <div class="pie-chart">
                <h2>Répartition des investissements</h2>
                <PieChart :data="investmentsPercentage" />
             </div>
            <!-- Top Performances -->
             <div class="top-investement">
                <h2>Top Performances</h2>
                <div class="top-investement-container">
                <div class="left-container">
                    <div class="img-container">
                    <img src="../../assets/amundi.png" alt="">
                    </div>
                    <div class="info">
                    <h4>{{ topPerformers[0].label }}</h4>
                    <p>{{ topPerformers[0].code }}</p>
                    </div>
                </div>
                <p class="top-perf-value">+{{ (topPerformers[0].diff_percent * 100).toFixed(2) }}%</p>
                </div>
                <div class="top-investement-container last">
                <div class="left-container">
                    <div class="img-container">
                    <img src="../../assets/ca.png" alt="">
                    </div>
                    <div class="info">
                    <h4>{{ topPerformers[1].label }}</h4>
                    <p>{{ topPerformers[1].code }}</p>
                    </div>
                </div>
                <p class="top-perf-value">+{{ (topPerformers[1].diff_percent * 100).toFixed(2) }}%</p>
                </div>
            </div>

            <!-- Worst Performances -->
            <div class="top-investement worst-investement">
                <h2>Worst Performances</h2>
                <div class="top-investement-container">
                <div class="left-container">
                    <div class="img-container">
                    <img src="../../assets/bnp.png" alt="">
                    </div>
                    <div class="info">
                    <h4>{{ worstPerformers[0].label }}</h4>
                    <p>{{ worstPerformers[0].code }}</p>
                    </div>
                </div>
                <p class="worst-perf-value">{{ (worstPerformers[0].diff_percent * 100).toFixed(2) }}%</p>
                </div>
                <div class="top-investement-container last">
                <div class="left-container">
                    <div class="img-container">
                    <img src="../../assets/amundi.png" alt="">
                    </div>
                    <div class="info">
                    <h4>{{ worstPerformers[1].label }}</h4>
                    <p>{{ worstPerformers[1].code }}</p>
                    </div>
                </div>
                <p class="worst-perf-value">{{ (worstPerformers[1].diff_percent * 100).toFixed(2) }}%</p>
                </div>
            </div>
        </div>

        
        <!-- Répartition géographique -->
        <div class="geographic-distribution">
            <h2>Répartition Géographique</h2>
            <div v-for="location in geographicDistribution" :key="location.market" class="geo-bar">
                <p>{{ location.market }} : {{ location.percentage }}%</p>
                <div class="bar">
                    <div class="bar-fill" :style="{ width: location.percentage + '%' }"></div>
                </div>
            </div>
        </div>
    </div>
        

    <!-- Message de chargement -->
    <div v-else>
    <p>Chargement des données...</p>
    </div>
</div>
</template>
  
  
<script>
import { getAccount, getCurveData } from "../../services/api";
import LinePEA from "./components/LinePEA.vue";
import PieChart from "./components//PieChart.vue";
import CurveChart from "./components/CurveChart.vue";

export default {
    components: {
        LinePEA,
        PieChart,
        CurveChart
    },
    computed: {
        accountId() {
            return this.$route.params.id;
        },
        investmentsPercentage() {
            if (!this.account || !this.account.investments) return [];
            const totalValuation = this.account.valuation;

            return this.account.investments.map((investment) => {
            const percentage = ((investment.valuation / totalValuation) * 100).toFixed(2);
            return {
                label: investment.label,
                percentage: percentage,
            };
            });
        },
        topPerformers() {
            if (!this.account || !this.account.investments) return [];
            // Trier par variation en pourcentage décroissante et prendre les deux premiers
            return [...this.account.investments]
                .sort((a, b) => b.diff_percent - a.diff_percent)
                .slice(0, 2);
        },
        worstPerformers() {
            if (!this.account || !this.account.investments) return [];
            // Trier par variation en pourcentage croissante et prendre les deux premiers
            return [...this.account.investments].sort((a, b) => a.diff_percent - b.diff_percent).slice(0, 2);
        },
        geographicDistribution() {
            if (!this.account || !this.account.investments) return [];
            const marketTotals = {};

            // Calculer la valorisation totale pour chaque marché
            this.account.investments.forEach((investment) => {
                const market = investment.stock_market || "Inconnu";
                marketTotals[market] = (marketTotals[market] || 0) + investment.valuation;
            });

            // Calculer la répartition en pourcentage
            const totalValuation = this.account.valuation;
            return Object.keys(marketTotals).map((market) => ({
                market,
                percentage: ((marketTotals[market] / totalValuation) * 100).toFixed(2),
            }));
        },
    },
    data() {
        return {
        account: null, // Contient les données du compte et des investissements
        curveData: null,
        loading: true, // Indique si les données sont en cours de chargement
        };
    },
    async mounted() {
        const user = JSON.parse(localStorage.getItem("user"));
        const sessionToken = localStorage.getItem("sessionToken");

        try {
        // Récupérer les données du compte via l'API
        const accountData = await getAccount(sessionToken, user.p_user_id, this.accountId, 2);
        this.account = accountData; // Stocker les données dans la variable `account`
        this.curveData = await getCurveData(sessionToken, user.p_user_id, this.accountId);
        } catch (error) {
        console.error("Erreur lors de la récupération du compte :", error);
        } finally {
        this.loading = false;
        }
    },
};
</script>
  

<style scoped>
#account-pea{
    display: flex;
    flex-wrap: wrap;
}

.part-1, .part-2 {
    display: flex;
}

.top-investement {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 390px;
    height: 220px;
    background-color: rgb(16, 16, 16);
    border: 1px solid rgb(66, 66, 66);
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.407);
    overflow: hidden;
}
.top-investement h2 {
    margin: 0 0 0 15px ;
}

.top-investement-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 15px;
    border-bottom: 0.1px solid rgb(47, 47, 47);
}
.last {
    border-bottom: none;
}

.img-container{
    width: 37px;
    height: 37px;
    background-color: black;
    border: 1px solid rgb(79, 79, 79);
    border-radius: 5px;
    overflow: hidden;
}
.img-container img {
    width: 100%;
}
.left-container {
    display: flex;
    align-items: center;
}

.info {
    margin-left: 15px;
    max-width: 80%;
}
.top-perf-value {
    color: rgb(0, 218, 0);
    font-weight: 200;
}

/* Section Worst Performances */
.worst-investement {
  background-color: rgb(16, 16, 16);
  border: 1px solid rgb(66, 66, 66);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.407);
  margin: 20px;
  min-width: 200px;
}

.worst-investement h2 {
  margin: 0 0 0 15px;
}

.worst-perf-value {
  color: rgb(218, 0, 0); /* Rouge pour les moins bonnes performances */
  font-weight: 200;
}



.geographic-distribution{
    margin: 20px 20px;
    border-radius: 20px;
    border: 1px solid rgb(56, 56, 56);
    padding: 20px;
}

.geo-bar {
    display: flex;
    margin-bottom: 15px;
}

.geo-bar p {
    margin: 20px 0 5px 0;
    font-size: 14px;
}

.bar {
    width: 100%;
    height: 8px;
    background-color: #2c2c2c; /* Couleur de fond (gris clair) */
    border-radius: 15px; /* Arrondir les coins */
    overflow: hidden;
    position: relative;
}

.bar-fill {
    height: 100%;
    background: linear-gradient(to left, rgb(113, 255, 113), rgb(0, 225, 255)); /* Couleur de remplissage */
    border-radius: 13px; /* Arrondir les coins */
    transition: width 0.3s ease-in-out;
}

.curve {
    width: 700px;
    height: 300px;
}

</style>