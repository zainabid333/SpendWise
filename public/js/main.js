document.addEventListener("DOMContentLoaded", function () {
  try {
    const totalExpensesElement = document.getElementById("total-expenses");
    if (totalExpensesElement) {
      calculateTotalExpenses();
    }

    const chartElement = document.getElementById("expenses-chart");
    if (chartElement) {
      createExpensesChart();
    }

    const deleteButtons = document.querySelectorAll(".delete-expense");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", deleteExpense);
    });
  } catch (error) {
    console.error("Error initializing page:", error);
  }
});

function deleteExpense(event) {
  // ... (keep the existing deleteExpense function)
  const row = event.target.closest("tr");
  if (row) {
    row.remove();
    
    calculateTotalExpenses();
    createExpensesChart();
  }

}

function calculateTotalExpenses() {
  const expenseRows = document.querySelectorAll("tbody tr");
  let totalExpenses = 0;
  expenseRows.forEach((row) => {
    const amountCell = row.querySelector("td:nth-child(2)");
    if (amountCell) {
      const amount = parseFloat(amountCell.textContent.replace("$", ""));
      totalExpenses += amount;
    }
  });
  document.getElementById("total-expenses").textContent =
    totalExpenses.toFixed(2);
}

function createExpensesChart() {
  const expenseRows = document.querySelectorAll("tbody tr");
  const categories = {};
  expenseRows.forEach((row) => {
    const categoryCell = row.querySelector("td:nth-child(3)");
    const amountCell = row.querySelector("td:nth-child(2)");
    if (categoryCell && amountCell) {
      const category = categoryCell.textContent;
      const amount = parseFloat(amountCell.textContent.replace("$", ""));
      categories[category] = (categories[category] || 0) + amount;
    }
  });

  const ctx = document.getElementById("expenses-chart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categories),
      datasets: [
        {
          label: "Expenses by Category",
          data: Object.values(categories),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ": $" + tooltipItem.raw.toFixed(2);
            },
          },
        },
      },
    },
  });
}
