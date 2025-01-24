<template>
  <a class="account-card" :href="dynamicLink">
    <h3>{{ account.name }}</h3>
    <p id="solde">{{ account.formatted_balance }}</p>
    <p class="info">Numéro de compte : {{ account.number }}</p>
    <p class="info">Type : {{ account.type }}</p>
    <p class="info" v-if="account.iban">IBAN : {{ account.iban }}</p>
    <p class="info" v-if="account.bic">BIC : {{ account.bic }}</p>
  </a>
</template>

<script>
const domain = 'localhost:5173';

export default {
  data() {
    return {
      baseLink: `http://${domain}/account/`,
    };
  },
  props: {
    account: {
      type: Object,
      required: true,
    },
  },
  computed: {
    dynamicLink() {
      // Déterminer le type de compte
      let typePath = 'current'; // Par défaut pour les comptes courants

      if (this.account.type === 'pea') {
        typePath = 'pea';
      } else if (this.account.type === 'savings') {
        typePath = 'savings';
      }

      // Construire l'URL avec l'id
      return `${this.baseLink}${typePath}/${this.account.id}`;
    },
  },
};
</script>

  
<style>
.account-card {
  border: 1px solid #ffffff25;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  text-decoration: none;
}

h3 {
  font-weight: 700;
}

#solde {
  font-size: 2rem;
  font-weight: 300;
}
.info {
  font-weight: 100;
  font-size: 0.8rem;
  color: #919191
}
</style>
  