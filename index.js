// index.js
document.getElementById('expense-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('expense-name').value;
  const amount = document.getElementById('expense-amount').value;

  const expense = {
    name,
    amount,
    date: new Date().toLocaleString()
  };

  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));

  displayExpenses();
  this.reset();
});

function displayExpenses() {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const list = document.getElementById('expense-list');
  list.innerHTML = '';

  expenses.forEach(exp => {
    const div = document.createElement('div');
    div.textContent = `${exp.name} - ₹${exp.amount} [${exp.date}]`;
    list.appendChild(div);
  });
}

window.onload = displayExpenses;
