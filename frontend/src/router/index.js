import { createRouter, createWebHistory } from 'vue-router';


// AUTH & Dashboard Routes
import RegisterUser from '../vues/Auth/RegisterUser.vue';
import LoginUser from '../vues/Auth/LoginUser.vue';
import Dashboard from '../vues/Auth/Dashboard.vue';
// Account View Routes
import AccountCurrent from '../vues/Account/AccountCurrent.vue';
import AccountSavings from '../vues/Account/AccountSavings.vue';
import AccountPEA from '../vues/Account/AccountPEA.vue';



const routes = [
    // AUTH & Dashboard Routes
    { path: '/', redirect: '/dashboard'},
    { path: '/register', name: 'Register', component: RegisterUser },
    { path: '/login', name: 'Login', component: LoginUser },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },

    // Account View Routes
    { path: '/account/current/:id', name: 'Current', component: AccountCurrent, props: true },
    { path: '/account/savings/:id', name: 'Savings', component: AccountSavings, props: true },
    { path: '/account/pea/:id', name: 'PEA', component: AccountPEA, props: true },
];

// Créer le routeur
const router = createRouter({
    history: createWebHistory(), // Utilise l'historique du navigateur
    routes,
});

// Guard global pour vérifier l'authentification
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('sessionToken'); // Vérifie si le token est présent dans localStorage
  
    if (to.meta.requiresAuth && !isAuthenticated) {
      // Si la route nécessite une authentification et que l'utilisateur n'est pas connecté
      console.warn('Accès refusé : utilisateur non connecté.');
      next('/login'); // Redirige vers la page de connexion
    } else {
      next(); // Continue vers la route demandée
    }
});

export default router;
