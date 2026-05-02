let cart = {};
let deliveryCost = 0;
let locationLink = "";

const products = [
  { id: 1, name: "Hot Dog", price: 25 },
  { id: 2, name: "Especial", price: 35 },
  { id: 3, name: "Hamburguesa", price: 50 },
  { id: 4, name: "Refresco", price: 20 }
];

// CARGAR MENÚ
function loadMenu() {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>$${p.price}</p>

      <div class="controls">
        <button onclick="changeQty(${p.id}, -1)">-</button>
        <span id="qty-${p.id}">0</span>
        <button onclick="changeQty(${p.id}, 1)">+</button>
      </div>
    `;

    menu.appendChild(div);
  });
}

// CAMBIAR CANTIDAD
function changeQty(id, change) {
  if (!cart[id]) {
    cart[id] = { qty: 0, product: products.find(p => p.id === id) };
  }

  cart[id].qty += change;

  if (cart[id].qty <= 0) {
    delete cart[id];
  }

  updateUI();
}

// ACTUALIZAR UI
function updateUI() {
  let total = 0;
  const cartList = document.getElementById("cart");
  cartList.innerHTML = "";

  Object.values(cart).forEach(item => {
    const subtotal = item.qty * item.product.price;
    total += subtotal;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.product.name} x${item.qty}
      <span>$${subtotal}</span>
    `;

    cartList.appendChild(li);

    document.getElementById(`qty-${item.product.id}`).textContent = item.qty;
  });

  document.getElementById("total").textContent = total + deliveryCost;
}

// ENVÍO
function updateDelivery() {
  const delivery = document.getElementById("delivery").value;
  deliveryCost = delivery === "delivery" ? 10 : 0;
  updateUI();
}

// UBICACIÓN
function getLocation() {
  if (!navigator.geolocation) {
    alert("Tu navegador no soporta ubicación");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      locationLink = `https://www.google.com/maps?q=${lat},${lon}`;
      document.getElementById("locText").textContent = "Ubicación lista 📍";
    },
    () => {
      alert("No se pudo obtener la ubicación");
    }
  );
}

// ENVIAR PEDIDO
function sendOrder() {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const delivery = document.getElementById("delivery").value;

  if (Object.keys(cart).length === 0) {
    alert("Agrega productos");
    return;
  }

  let total = 0;
  let message = `🍔 *Nuevo Pedido*%0A%0A`;
  message += `👤 ${name}%0A`;

  if (delivery === "delivery") {
    message += `🏠 ${address}%0A`;
  } else {
    message += `📍 Recoger en local%0A`;
  }

  message += `%0A🛒 Pedido:%0A`;

  Object.values(cart).forEach(item => {
    const subtotal = item.qty * item.product.price;
    total += subtotal;
    message += `- ${item.product.name} x${item.qty} = $${subtotal}%0A`;
  });

  total += deliveryCost;

  message += `%0ATotal: $${total}%0A`;

  if (locationLink) {
    message += `%0A📍 Ubicación:%0A${locationLink}`;
  }

  const phone = "5219991234567"; // CAMBIA TU NÚMERO

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}

// REINICIAR
function resetOrder() {
  cart = {};
  deliveryCost = 0;
  locationLink = "";

  document.getElementById("name").value = "";
  document.getElementById("address").value = "";
  document.getElementById("delivery").value = "pickup";
  document.getElementById("locText").textContent = "Sin ubicación";

  updateUI();
}

// INICIO
loadMenu();