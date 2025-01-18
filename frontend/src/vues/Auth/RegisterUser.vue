<template>
    <div>
      <h2>Créer un compte</h2>
      <form @submit.prevent="register">
        <input type="text" v-model="firstname" placeholder="Prénom" required />
        <input type="text" v-model="lastname" placeholder="Nom" required />
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Mot de passe" required />
        <input type="date" v-model="dateOfBirth" placeholder="Date de naissance" required />
        <button type="submit">S'inscrire</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import { registerUser } from '../../services/api';
  
  export default {
    data() {
      return {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        dateOfBirth: '',
        message: '',
      };
    },
    methods: {
      async register() {
        console.log("Register processing ...");
        try {
          const response = await registerUser({
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password,
            dateOfBirth: this.dateOfBirth,
          });
          this.message = response.message;
        } catch (error) {
          this.message = error.response?.data?.message || 'Erreur lors de l\'inscription.';
        }
      },
    },
  };
  </script>
  