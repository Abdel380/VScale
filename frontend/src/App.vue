<template>
  <div>
    <h1>TScale</h1>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

* {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  color: white;
}

body {
  background-color: #1f1f1f;
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  background: linear-gradient(to right, rgb(137, 200, 255), rgb(138, 255, 138));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block; /* Permet au conteneur de s'ajuster à la taille du texte */
}

button {
  background: #1f1f1f;
  color: white;
  padding: 8px 12px;
  border: 1px solid grey;
  border-radius: 100px;
  transition: all 0.3s ease;
}
button:hover {
  background-color: #131313;
  cursor: pointer;
}
</style>
