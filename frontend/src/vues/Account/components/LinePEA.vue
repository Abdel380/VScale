<template>
    <div class="line-pea">
      <p id="label">{{ investment.label }}</p>
      <div class="info">
        <h3 id="valorisation">{{ investment.valuation }} €</h3>
        <p id="isin">{{ investment.code }}</p>
        <p id="quantity">Quantité : {{ investment.quantity }}</p>
        <p id="price">Prix unitaire : {{ investment.unitprice }} €</p>
      </div>
      <p>
        <span :class="{ positive: investment.diff >= 0, negative: investment.diff < 0 }">
          {{ investment.diff.toFixed(2) }} €<br>({{ (investment.diff_percent * 100).toFixed(2) }}%)
        </span>
      </p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      investment: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .positive {
    color: green;
  }
  
  .negative {
    color: red;
  }

  .line-pea {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    margin: 10px;
    max-width: 600px;
    background-color: rgb(16, 16, 16);
    border: 1px solid rgb(35, 35, 35);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.258);
  }

  #label {
    font-weight: 700;
    max-width: 150px;
  }

  .info {
    font-size: 14px;
    font-weight: 100;
    width: 50%;
  }
  h3 {
    font-size: 30px;
  }
  #isin {
    font-weight: 300;
    text-decoration: underline;
    color: rgb(162, 162, 162);
  }

  </style>
  