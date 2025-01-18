import { createRouter, createWebHistory } from 'vue-router';
import RegisterUser from '../vues/Auth/RegisterUser.vue';
import LoginUser from '../vues/Auth/LoginUser.vue';
import Dashboard from '../vues/Auth/Dashboard.vue';

// Définir les routes
const routes = [
    {
        path: '/register',
        name: 'Register',
        component: RegisterUser,
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginUser,
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
    },
    {
        path: '/',
        redirect: '/dashboard', // Redirige la racine vers la page de dashboard
    },
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
