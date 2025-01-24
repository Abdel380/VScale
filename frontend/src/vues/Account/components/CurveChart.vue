<template>
    <div class="chart-container">
      <canvas id="curve-chart"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart } from "chart.js/auto";
  
  export default {
    props: {
      data: {
        type: Array,
        required: true,
      },
    },
    mounted() {
      this.renderChart();
    },
    methods: {
      renderChart() {
        const ctx = document.getElementById("curve-chart").getContext("2d");
  
        // Préparer les labels (dates) et les valeurs (balances)
        const labels = this.data.map((point) => point.date);
        const balances = this.data.map((point) => point.balance);
  
        // Configurer Chart.js
        new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Valorisation (€)",
                data: balances,
                borderColor: "rgb(255, 204, 0)", // Couleur de la ligne
                backgroundColor: "rgba(255, 204, 0, 0)", // Couleur de remplissage
                borderWidth: 2,
                tension: 0.5, // Courbe lissée
                pointRadius: 0, // Supprime les points
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: false, // Désactiver la légende
              },
              tooltip: {
                enabled: false, // Désactiver le tooltip par défaut
                mode: "nearest", // Affiche le point le plus proche
                intersect: false, // Affiche le tooltip même entre les points
                external: (context) => {
                  let tooltipEl = document.getElementById("chart-tooltip");
  
                  // Créer l'élément s'il n'existe pas
                  if (!tooltipEl) {
                    tooltipEl = document.createElement("div");
                    tooltipEl.id = "chart-tooltip";
                    tooltipEl.style.position = "absolute";
                    tooltipEl.style.background = "rgba(0, 0, 0, 0.1)"; // Arrière-plan noir semi-transparent
                    tooltipEl.style.backdropFilter = "blur(5px)"; // Effet de flou
                    tooltipEl.style.borderRadius = "5px";
                    tooltipEl.style.border = "1px solid rgb(53, 53, 53)";
                    tooltipEl.style.color = "#fff";
                    tooltipEl.style.padding = "10px";
                    tooltipEl.style.pointerEvents = "none"; // Désactive les interactions
                    tooltipEl.style.transition = "all 0.3s ease"; // Transition douce
                    tooltipEl.style.opacity = 0;
                    tooltipEl.style.zIndex = 999;
                    tooltipEl.style.transform = "translate(-50%, -50%)"; // Centrage
                    document.body.appendChild(tooltipEl);
                  }
  
                  const tooltip = context.tooltip;
  
                  // Si aucune donnée n'est survolée
                  if (!tooltip || tooltip.opacity === 0) {
                    tooltipEl.style.opacity = 0;
                    return;
                  }
  
                  // Mettre à jour le contenu du tooltip
                  if (tooltip.body) {
                    const date = tooltip.dataPoints[0].label;
                    const balance = tooltip.dataPoints[0].formattedValue;
                    tooltipEl.innerHTML = `
                      <div style="text-align: left;">
                        <div style="font-size: 12px; color: #aaa;">${date}</div>
                        <div style="font-size: 16px; color: #ffc800; font-weight: bold;">${balance} €</div>
                      </div>`;
                  }
  
                  // Positionner le tooltip
                  const chartPosition = context.chart.canvas.getBoundingClientRect();
                  tooltipEl.style.opacity = 1;
                  tooltipEl.style.left =
                    chartPosition.left + window.pageXOffset + tooltip.caretX + "px";
                  tooltipEl.style.top =
                    chartPosition.top + window.pageYOffset + tooltip.caretY - 50 + "px";
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false, // Désactiver les lignes verticales
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.2)", // Couleur des labels de l'axe X
                  maxTicksLimit: 7, // Limiter le nombre de labels sur l'axe X
                },
              },
              y: {
                grid: {
                  color: "rgba(255, 255, 255, 0.07)", // Couleur des lignes horizontales
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.5)", // Couleur des labels de l'axe Y
                  callback: (value) => `${value} €`, // Format des valeurs sur l'axe Y
                },
              },
            },
          },
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    height: 400px;
    width: 100%;
    margin: 20px 0;
  }
  
  /* Tooltip personnalisé */
  #chart-tooltip {
    position: absolute;
    z-index: 999;
    pointer-events: none;
    opacity: 0;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    transition: all 0.3s ease; /* Transition fluide */
  }
  </style>