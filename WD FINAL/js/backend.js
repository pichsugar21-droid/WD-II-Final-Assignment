const products = [
  { name: 'Lays Classic', price: 5.00, image: "https://i.postimg.cc/ryjPf3w4/Lays-XL-Classic-Laydown.png" },
  { name: 'Lays All Dressed', price: 5.00, image: "https://i.postimg.cc/bNd33v5M/Lays-XL-All-Dressed-Laydown.png" },
  { name: 'Lays BBQ', price: 5.00, image: "https://i.postimg.cc/Z5djzM4Q/Lays-XL-BBQ-Laydown.png" },
  { name: 'Lays Limo', price: 5.00, image: "https://i.postimg.cc/VvvBG7KS/Lays-XL-Limon-Laydown.png" },
  { name: 'Doritos Nacho', price: 7.00, image: "https://i.postimg.cc/DzhQkfC8/new-nacho-cheese-2024.png" },
  { name: 'Doritos Salsa', price: 7.00, image: "https://i.postimg.cc/J0sZcshx/new-salsa-verde.png" },
  { name: 'Doritos Chilli', price: 7.00, image: "https://i.postimg.cc/CxGDNTwr/new-sweet-chili.png" },
  { name: 'Doritos Ranch', price: 1.00, image: "https://i.postimg.cc/W3HJ3s7G/new-nacho-cool-ranch-2024.png" },
  { name: 'Oreo Classic', price: 1.00, image: "https://i.postimg.cc/PxgYyt8h/d14bdc39-49f5-4822-93a7-bc709c084d3a.webp" },
  { name: 'Oreo Brownie', price: 1.00, image: "https://i.postimg.cc/t4b0fWH1/2b0f36a9-a166-4d9f-afd1-cbc6c3a97e14.webp" },
  { name: 'Oreo Gingerbread', price: 1.00, image: "https://i.postimg.cc/Gp3W3RtD/646ef664-4a2b-47b1-be27-31230cd91123.webp" },
  { name: 'Oreo Golden', price: 1.00, image: "https://i.postimg.cc/DZHHcbgZ/191c7c21-9f57-4a7c-b98f-70325e0b6a29.webp" },
];

let cart = [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];


function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}


function renderProducts(filtered = products) {
  const productList = document.querySelector('.product-list');
  if (!productList) return;
  productList.innerHTML = '';
  filtered.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" width="150">
      <h3>${product.name}</h3>
      <p>Price: $${product.price.toFixed(2)}</p>
      <button class="btn btn-outline-primary" onclick="addToCart('${product.name}')">Add to Cart</button>
    `;
    productList.appendChild(productCard);
  });
}

function renderCart() {
  const cartItems = document.querySelector('.cart-items');
  if (!cartItems) return;
  cartItems.innerHTML = '';
  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <button class="btn btn-outline-primary decrease" data-index="${index}">-</button>
        ${item.quantity}
        <button class="btn btn-outline-primary increase" data-index="${index}">+</button>
      </td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
      <td>
        <button class="btn btn-outline-primary" onclick="removeFromCart(${index})">Remove</button>
      </td>
    `;
    cartItems.appendChild(row);
  });
}

function updateTotal() {
  const totalEl = document.querySelector('.cart-total');
  if (!totalEl) return;
  let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalEl.textContent = total.toFixed(2);
}

window.addToCart = function(name) {
  const product = products.find(p => p.name === name);
  if (!product) return;

  const qty = prompt(`Enter quantity for ${name}:`, "1");
  const quantity = parseInt(qty);
  if (isNaN(quantity) || quantity < 1) {
    alert("❌ Quantity must be at least 1");
    return;
  }

  const existingItem = cart.find(item => item.name === product.name);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name: product.name, price: product.price, quantity: quantity });
  }
  renderCart();
  updateTotal();
};

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  renderCart();
  updateTotal();
};


document.addEventListener('click', function(e) {
  if (e.target.classList.contains('increase') || e.target.classList.contains('decrease')) {
    const index = parseInt(e.target.dataset.index);
    if (isNaN(index)) return;
    if (e.target.classList.contains('increase')) {
      cart[index].quantity++;
    } else if (cart[index].quantity > 1) {
      cart[index].quantity--;
    }
    renderCart();
    updateTotal();
  }
});

window.saveCartManually = function() {
  localStorage.setItem('cart', JSON.stringify(cart));
  alert("Cart saved successfully!");
};

window.loadCartManually = function() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    renderCart();
    updateTotal();
    alert("Cart loaded successfully!");
  } else {
    alert("No saved cart found!");
  }
};

window.completeSale = function() {
  if (cart.length === 0) {
    alert("🛒 Cart is empty!");
    return;
  }

  const now = new Date();
  const transaction = {
    id: Date.now(),
    date: now.toLocaleDateString('en-US'),
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    items: [...cart],
    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  };

  transactions.unshift(transaction);
  saveTransactions();
  printReceipt();

  cart = [];
  renderCart();
  updateTotal();
};


window.printReceipt = function() {
  if (cart.length === 0) {
    alert("🛒 Cart is empty!");
    return;
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US');

  let receiptHTML = `
    <div style="font-family: 'Poppins', Regular; width: 380px; margin: 0 auto; padding: 25px; background: white; border: 1px solid #ddd; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 42px; font-weight: bold; color: #ff0000; margin: 0; letter-spacing: -2px;">ThongPich Mart</h1>
        <p style="margin: 5px 0 0; font-size: 14px; color: #555;">Receipt & Product</p>
      </div>

      <hr style="border: none; border-top: 2px dashed #333; margin: 15px 0;">

      <div style="font-size: 14px;">
        <div><strong>Date</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${dateStr}</div>
        <div><strong>Manager</strong> &nbsp;: Ly ThongPich</div>
        <div><strong>Cashier</strong> &nbsp;: Pich SeakLeng</div>
      </div>

      <hr style="border: none; border-top: 2px dashed #333; margin: 15px 0;">

      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
        <tbody>
  `;

  let total = 0;
  cart.forEach(item => {
    const amount = item.price * item.quantity;
    total += amount;
    receiptHTML += `
      <tr>
        <td style="padding: 5px 0;">${item.name.toUpperCase()}</td>
        <td style="padding: 5px 0; text-align: right;">${item.quantity} x $${item.price.toFixed(2)}</td>
        <td style="padding: 5px 0; text-align: right; font-weight: bold;">$${amount.toFixed(2)}</td>
      </tr>
    `;
  });

  receiptHTML += `
        </tbody>
      </table>

      <hr style="border: none; border-top: 2px dashed #333; margin: 15px 0;">

      <table style="width: 100%; font-size: 16px;">
        <tr>
          <td><strong>Total</strong></td>
          <td style="text-align: right; font-weight: bold;">$${total.toFixed(2)}</td>
        </tr>
      </table>

      <hr style="border: none; border-top: 2px dashed #333; margin: 15px 0;">

      <div style="text-align: center;">
        <h2 style="font-size: 28px; color: #ff0000; margin: 0;">Thank you for coming</h2>
   
      </div>
    </div>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(receiptHTML);
  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => printWindow.print(), 600);
};


window.viewReports = function() {
  window.open('reports.html', '_blank');
};


function renderTransactions(filtered = transactions) {
  const container = document.getElementById('transaction-list');
  if (!container) return;

  let html = `
    <table class="table" style="width:100%; border-collapse: collapse; background:white;">
      <thead>
        <tr style="background:#f8f9fa;">
          <th>Date & Time</th>
          <th>Transaction ID</th>
          <th>Items (Products)</th>
          <th>Total Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
  `;

  filtered.forEach(t => {
    const itemsList = t.items.map(item => `${item.name} (x${item.quantity})`).join(', ');
    html += `
      <tr>
        <td>${t.date} ${t.time}</td>
        <td><strong>#${t.id}</strong></td>
        <td style="max-width: 450px;">${itemsList}</td>
        <td><strong>$${t.total.toFixed(2)}</strong></td>
        <td>
          <button onclick="printSpecificReport(${t.id})" class="btn btn-outline-primary">Print Invoice</button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

window.filterByDate = function() {
  const fromDate = document.getElementById('fromDate')?.value;
  const toDate = document.getElementById('toDate')?.value;

  let filtered = transactions;

  if (fromDate) {
    filtered = filtered.filter(t => new Date(t.date) >= new Date(fromDate));
  }
  if (toDate) {
    filtered = filtered.filter(t => new Date(t.date) <= new Date(toDate));
  }

  renderTransactions(filtered);
};

window.resetDateFilter = function() {
  if (document.getElementById('fromDate')) document.getElementById('fromDate').value = '';
  if (document.getElementById('toDate')) document.getElementById('toDate').value = '';
  renderTransactions();
};

window.printSpecificReport = function(id) {
  const trans = transactions.find(t => t.id === id);
  if (!trans) return;
  
  let html = `
    <div style="padding:25px; font-family:Courier New; width:400px; margin:0 auto;">
      <h2 style="text-align:center;">Invoice #${trans.id}</h2>
      <p>${trans.date} | ${trans.time}</p>
      <hr>
      <table style="width:100%;">
  `;
  trans.items.forEach(item => {
    const amount = item.price * item.quantity;
    html += `<tr><td>${item.name}</td><td>${item.quantity} x $${item.price.toFixed(2)}</td><td>$${amount.toFixed(2)}</td></tr>`;
  });
  html += `</table><hr><h3 style="text-align:right;">Total: $${trans.total.toFixed(2)}</h3></div>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 500);
};

window.printAllReport = function() {
  if (transactions.length === 0) return alert("No transactions!");
  let html = `<h2>All Transactions Report</h2>`;
  transactions.forEach(t => {
    html += `<p>#${t.id} - ${t.date} ${t.time} - Total: $${t.total.toFixed(2)}</p>`;
  });
  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 500);
};

window.clearHistory = function() {
  if (confirm("Clear all transaction history?")) {
    transactions = [];
    saveTransactions();
    renderTransactions();
  }
};


document.getElementById('productSearch')?.addEventListener('input', function() {
  const term = this.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(term));
  renderProducts(filtered);
});

document.getElementById('reportSearch')?.addEventListener('input', function() {
  const term = this.value.toLowerCase();
  const filtered = transactions.filter(t => 
    t.date.includes(term) || t.items.some(i => i.name.toLowerCase().includes(term))
  );
  renderTransactions(filtered);
});


document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key.toLowerCase() === 'p') {
    e.preventDefault();
    completeSale();
  }
});


if (document.querySelector('.product-list')) {
  renderProducts();
  loadCartManually();
  updateTotal();
}

if (document.getElementById('transaction-list')) {
  renderTransactions();
}