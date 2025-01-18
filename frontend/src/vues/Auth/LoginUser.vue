<template>
    <div>
      <h2>Se connecter</h2>
      <form @submit.prevent="login">
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Mot de passe" required />
        <button type="submit">Connexion</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import { loginUser } from '../../services/api';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        message: '',
      };
    },
    methods: {
      async login() {
        try {
          const response = await loginUser({
            email: this.email,
            password: this.password,
          });

          console.log(response);
  
          // Stocker le token de session dans le localStorage
          localStorage.setItem('sessionToken', response.sessionUser.sessionToken);
          localStorage.setItem('user', JSON.stringify(response.sessionUser));
          this.$router.push('/dashboard'); // Rediriger vers le tableau de bord

        } catch (error) {
          this.message = error.response?.data?.message || 'Erreur lors de la connexion.';
        }
      },
    },
  };
  </script>
  