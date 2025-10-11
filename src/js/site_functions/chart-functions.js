import { getRandomColor } from "../users-functions/format.js";

let statisticsChart = null;

export function initializeStatisticsTabs() {
  const tabs = document.querySelectorAll(".statistics__tab");
  const tableView = document.getElementById("statistics-table-view");
  const chartView = document.getElementById("statistics-chart-view");
  const reportsView = document.getElementById("statistics-reports-view");

  if (!tabs.length || !tableView || !chartView || !reportsView) {
    console.warn("Statistics tabs elements not found");
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabType = tab.dataset.tab;

      tabs.forEach((t) => t.classList.remove("statistics__tab--active"));
      tab.classList.add("statistics__tab--active");

      tableView.style.display = "none";
      chartView.style.display = "none";
      reportsView.style.display = "none";

      if (tabType === "table") {
        tableView.style.display = "block";
      } else if (tabType === "chart") {
        chartView.style.display = "block";
        createStatisticsPieChart();
      } else if (tabType === "reports") {
        reportsView.style.display = "block";
        if (
          window.currentTeachersData &&
          window.currentTeachersData.length > 0
        ) {
          import("./reports-functions.js").then((module) => {
            module.updateReports(window.currentTeachersData);
          });
        }
      }
    });
  });
}

export function createStatisticsPieChart() {
  const canvas = document.getElementById("statistics-pie-chart");
  if (!canvas) {
    console.warn("Chart canvas not found");
    return;
  }

  if (statisticsChart) {
    statisticsChart.destroy();
  }

  const teachers = window.currentTeachersData || [];

  if (teachers.length === 0) {
    // якщо немає даних, то повідомлення
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "16px Arial";
    ctx.fillStyle = "#666";
    ctx.textAlign = "center";
    ctx.fillText("No data available", canvas.width / 2, canvas.height / 2);
    return;
  }

  // розрахунок статистики по спеціальності
  const specialtyStats = calculateSpecialtyStatistics(teachers);

  // підготовка даних для графіка
  const labels = Object.keys(specialtyStats);
  const data = Object.values(specialtyStats);
  const colors = generateColors(labels.length);

  statisticsChart = new Chart(canvas, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderColor: colors.map((color) => color),
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Teachers by Specialty",
          font: {
            size: 16,
            weight: "bold",
          },
        },
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000,
      },
    },
  });
}

function calculateSpecialtyStatistics(teachers) {
  const stats = {};

  teachers.forEach((teacher) => {
    const specialty = teacher.course || "Unknown";
    stats[specialty] = (stats[specialty] || 0) + 1;
  });

  return stats;
}

function generateColors(count) {
  const colors = [];

  for (let i = 0; i < count; i++) {
    colors.push(getRandomColor());
  }

  return colors;
}

export function updateStatisticsChart() {
  if (
    document.getElementById("statistics-chart-view").style.display !== "none"
  ) {
    createStatisticsPieChart();
  }
}
