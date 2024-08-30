document.addEventListener('DOMContentLoaded', function () {
  try {
    const totalExpensesElement = document.getElementById('total-expenses');
    if (totalExpensesElement) {
      calculateTotalExpenses();
    }

    const expensesChartElement = document.getElementById('expenses-chart');
    if (expensesChartElement) {
      createExpensesChart();
    }

    const budgetChartElement = document.getElementById('budget-chart');
    if (budgetChartElement) {
      createBudgetChart();
    }

    // Set today's date as default for the date input
    const dateInput = document.getElementById('date');
    const today = new Date();
    const localDate = new Date(
      today.getTime() - today.getTimezoneOffset() * 60 * 1000
    )
      .toISOString()
      .split('T')[0];
    dateInput.value = localDate;

    // Handle delete button click
    const deleteButtons = document.querySelectorAll('.delete-expense');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', deleteExpense);
    });

    // Modal logic
    const categorySelect = document.getElementById('category');
    const modal = document.getElementById('newCategoryModal'); // Modal element
    const closeModalButton = document.getElementById('closeModalButton');

    // Open modal when 'Add new Category' is selected
    categorySelect.addEventListener('change', function () {
      if (categorySelect.value === 'new') {
        modal.classList.remove('hidden'); // Show the modal
      }
    });

    // Close modal on 'Cancel' button click
    closeModalButton.addEventListener('click', function () {
      modal.classList.add('hidden'); // Hide the modal
      categorySelect.value = ''; // Reset the category selection
    });
  } catch (error) {
    console.error('Error initializing page:', error);
  }
});

async function deleteExpense(event) {
  // Get the expense ID from the button's data attribute
  const expenseId = this.getAttribute('data-id'); // Corrected attribute to 'data-id'

  if (!expenseId) {
    console.error('Expense ID is not found');
    return;
  }

  const confirmDelete = confirm(
    'Are you sure you want to delete this expense?'
  );
  if (!confirmDelete) return;

  try {
    const response = await fetch(`/expenses/${expenseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('Expense deleted successfully');
      // Recalculate total expenses and update chart
      calculateTotalExpenses();
      location.reload(); // Refresh to update the UI
    } else {
      alert('Failed to delete expense');
      console.error('Failed to delete expense');
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
}

function calculateTotalExpenses() {
  const expenseRows = document.querySelectorAll('tbody tr');
  let totalExpenses = 0;

  expenseRows.forEach((row) => {
    const typeCell = row.querySelector('td:nth-child(4)'); 
    const amountCell = row.querySelector('td:nth-child(2)'); 

    if (typeCell && typeCell.textContent.trim() === 'Expense' && amountCell) {
      const amount = parseFloat(amountCell.textContent.replace('$', ''));
      if (!isNaN(amount)) totalExpenses += amount;
    }
  });

  document.getElementById('total-expenses').textContent =
    totalExpenses.toFixed(2);
}
function createBudgetChart() {
  const totalExpenses = parseFloat(
    document.getElementById('total-expenses').textContent
  );
  const budget = parseFloat(document.getElementById('budget').textContent);

  const ctx = document.getElementById('budget-chart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Expenses', 'Remaining Budget'],
      datasets: [
        {
          label: 'Budget Overview',
          data: [totalExpenses, Math.max(0, budget - totalExpenses)],
          backgroundColor: ['#FF6384', '#36A2EB'],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return (
                tooltipItem.label +
                ': $' +
                tooltipItem.raw
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
              );
            },
          },
        },
      },
    },
  });
}

function createExpensesChart() {
  const expenseRows = document.querySelectorAll('.transaction-item'); // Selecting all transactions
  const categories = {};

  expenseRows.forEach((row) => {
    const categoryCell = row.querySelector('td:nth-child(3)'); // Category in 3rd column
    const amountCell = row.querySelector('td:nth-child(2)'); // Amount in 2nd column
    const typeCell = row.querySelector('td:nth-child(4)'); // Type in 4th column

    if (typeCell && typeCell.textContent.trim() === 'Expense') {
      const category = categoryCell.textContent.trim();
      const amount = parseFloat(amountCell.textContent.replace('$', '').trim());

      if (!isNaN(amount)) {
        categories[category] = (categories[category] || 0) + amount;
      }
    }
  });

  const ctx = document.getElementById('expenses-chart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categories),
      datasets: [
        {
          label: 'Expenses by Category',
          data: Object.values(categories),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ': $' + tooltipItem.raw.toFixed(2);
            },
          },
        },
      },
    },
  });
}
