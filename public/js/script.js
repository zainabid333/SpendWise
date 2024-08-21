const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const notification = document.getElementById('notification');

const dummyTransactions = [
  { id: 1, text: 'Flower', amount: -20 },
  { id: 2, text: 'Salary', amount: 300 },
  { id: 3, text: 'Book', amount: -10 },
  { id: 4, text: 'Camera', amount: 150 },
];

let transactions = dummyTransactions;

function showNotification() {
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '') {
    showNotification();
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    // updateLocaleStorage();
    text.value = '';
    amount.value = '';
  }
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(sign === '+' ? 'plus' : 'minus');
  item.innerHTML = `
          ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span
          ><button class="delete-btn" onclick="removeTransaction(${
            transaction.id
          })"><i class="fa fa-times"></i></button>
    `;
  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts
    .reduce((accumulator, value) => (accumulator += value), 0)
    .toFixed(2);
  const income = amounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => (accumulator += value), 0)
    .toFixed(2);
  const expense = (
    amounts
      .filter((value) => value < 0)
      .reduce((accumulator, value) => (accumulator += value), 0) * -1
  ).toFixed(2);
  balance.innerText = `$${total}`;
  moneyPlus.innerText = `$${income}`;
  moneyMinus.innerText = `$${expense}`;
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  // updateLocaleStorage();
  init();
}

// Init
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

console.clear();

// you can find the server side code at 'https://repl.it/@mauriciolobo/expensetracker'
// Just replace with you address and start playing arround
var url = 'https://expensetracker--mauriciolobo.repl.co/';

Vue.filter('money', (v) => {
  return '$' + parseFloat(v).toFixed(2);
});

var app = new Vue({
  el: '#app',

  data() {
    return {
      transactions: [],
      transaction: {},
    };
  },

  computed: {
    balance() {
      return this.transactions.reduce((c, p) => c + p.amount, 0);
    },

    income() {
      return this.transactions
        .filter((f) => f.amount > 0)
        .reduce((c, p) => c + p.amount, 0);
    },

    expense() {
      return this.transactions
        .filter((f) => f.amount < 0)
        .reduce((c, p) => c + p.amount, 0);
    },
  },

  methods: {
    get() {
      axios
        .get(url)
        .then((r) => r.data)
        .then((r) =>
          r.map((m) => {
            return { ...m, amount: parseFloat(m.amount) };
          })
        )
        .then((r) => (this.transactions = r));
    },

    add() {
      axios
        .post(url, this.transaction)
        .then((t) => t.data)
        .then(() => {
          this.transaction = {};
        })
        .then(() => {
          this.get();
        })
        .catch(console.error);
    },
  },

  mounted() {
    this.get();
  },
});

form.addEventListener('submit', addTransaction);
