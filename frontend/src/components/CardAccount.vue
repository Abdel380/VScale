<template>
    <div class="account-card">
      <h3>{{ account.name }}</h3>
      <p id="solde">{{ account.formatted_balance }}</p>
      <p class="info">Numéro de compte : {{ account.number }}</p>
      <p class="info">Type : {{ account.type }}</p>
      <p class="info" v-if="account.iban">IBAN : {{ account.iban }}</p>
      <p class="info" v-if="account.bic">BIC : {{ account.bic }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      account: {
        type: Object,
        required: true,
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
  