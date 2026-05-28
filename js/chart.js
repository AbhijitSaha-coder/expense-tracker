const CHART_COLORS = [
  '#3b6ea8',
  '#c45c4a',
  '#2d8a5e',
  '#8a6bb8',
  '#d4a03c',
  '#5c8a9a',
  '#a85c7a',
  '#6a7a8a',
];

const chartInstances = {};

export function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

export function renderDoughnutChart(canvasId, labels, values, formatTooltip) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas || labels.length === 0) return false;

  chartInstances[canvasId] = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data: values, backgroundColor: CHART_COLORS.slice(0, labels.length), borderWidth: 1 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
        tooltip: {
          callbacks: {
            label(ctx) {
              return ` ${ctx.label}: ${formatTooltip(ctx.parsed)}`;
            },
          },
        },
      },
    },
  });
  return true;
}

export function renderLineChart(canvasId, labels, values, label, formatTooltip) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return false;

  chartInstances[canvasId] = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label,
          data: values,
          borderColor: '#3b6ea8',
          backgroundColor: 'rgba(59, 110, 168, 0.12)',
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(ctx) {
              return ` ${formatTooltip(ctx.parsed.y)}`;
            },
          },
        },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
  return true;
}

export function renderBarChart(canvasId, labels, values, label, formatTooltip) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return false;

  chartInstances[canvasId] = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label,
          data: values,
          backgroundColor: CHART_COLORS.slice(0, labels.length),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(ctx) {
              return ` ${formatTooltip(ctx.parsed.y)}`;
            },
          },
        },
      },
      scales: { y: { beginAtZero: true } },
    },
  });
  return true;
}
