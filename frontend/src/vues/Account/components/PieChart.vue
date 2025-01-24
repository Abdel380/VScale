<template>
    <div>
      <canvas id="pie-chart"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from "chart.js";
  
  Chart.register(...registerables);
  
  export default {
    props: {
      data: {
        type: Array,
        required: true,
      },
    },
    mounted() {
      const ctx = document.getElementById("pie-chart").getContext("2d");
  
      // Extraire les labels et les valeurs des données passées en props
      const labels = this.data.map((item) => item.label);
      const values = this.data.map((item) => parseFloat(item.percentage));
  
      // Générer des couleurs dynamiques pour chaque élément
      const baseColors = this.generateDynamicColors(labels.length);
  
      // Création du diagramme en camembert
      this.chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Répartition des investissements",
              data: values,
              backgroundColor: baseColors, // Couleurs dynamiques
              borderWidth: 0, // Supprimer les bordures entre les segments
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false, // Désactiver la légende
            },
            tooltip: {
              callbacks: {
                // Personnalisation de l'infobulle
                label: function (tooltipItem) {
                  const percentage = tooltipItem.raw; // Récupère la valeur brute (83, 50, etc.)
                  return `${percentage}%`; // Retourne un texte formaté
                },
              },
            },
          },
          interaction: {
            mode: "nearest", // Interaction avec le segment le plus proche
            intersect: true,
          },
          onHover: (event, chartElement) => {
            const dataset = this.chart.data.datasets[0];
  
            if (chartElement.length) {
              const hoveredIndex = chartElement[0].index;
              const modifiedColors = [];
  
              // Appliquer les couleurs avec opacité 1 pour le segment survolé
              for (let i = 0; i < baseColors.length; i++) {
                if (i === hoveredIndex) {
                  // Remplacer l'opacité par 1 pour l'élément survolé
                  modifiedColors[i] = baseColors[i].replace(/0\.5\)/, "1)");
                } else {
                  // Garder les autres éléments avec une opacité réduite
                  modifiedColors[i] = baseColors[i];
                }
              }
              dataset.backgroundColor = modifiedColors;
            } else {
              // Restaurer les couleurs d'origine lorsque la souris quitte
              dataset.backgroundColor = baseColors;
            }
  
            this.chart.update(); // Mettre à jour le graphique
          },
        },
      });
    },
    methods: {
      // Génère des couleurs dynamiques pour chaque élément
      generateDynamicColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
          const r = Math.floor(Math.random() * 255); // Rouge aléatoire
          const g = Math.floor(Math.random() * 255); // Vert aléatoire
          const b = Math.floor(Math.random() * 255); // Bleu aléatoire
          colors.push(`rgba(${r}, ${g}, ${b}, 0.5)`); // Ajouter au tableau
        }
        return colors;
      },
      // Ajuste l'opacité d'une couleur RGBA
      adjustOpacity(color, opacity) {
        if (typeof color !== "string" || !color.includes("rgba")) {
          // Si la couleur n'est pas au format attendu, on retourne la couleur inchangée
          return color;
        }
        return color.replace(/[\d.]+(?=\))$/, opacity); // Remplace l'opacité dans "rgba(r,g,b,opacity)"
      },
    },
  };
  </script>
  
  <style scoped>
  canvas {
    max-width: 400px;
    margin: 0 auto;
  }
  </style>
  