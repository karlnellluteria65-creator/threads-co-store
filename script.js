// Demo products: replace names, prices, and photo links with your own store inventory.
const products = [
  {id:1,name:"The Everyday Tee",category:"Tops",price:499,tag:"BESTSELLER",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85"},
  {id:2,name:"Relaxed Linen Shirt",category:"Tops",price:899,tag:"NEW",image:"https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=700&q=85"},
  {id:3,name:"Classic Straight Pants",category:"Bottoms",price:1099,tag:"",image:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=85"},
  {id:4,name:"Weekend Denim",category:"Bottoms",price:1299,tag:"POPULAR",image:"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=85"},
  {id:5,name:"Everyday Tote",category:"Accessories",price:399,tag:"",image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=85"},
  {id:6,name:"Minimal Cap",category:"Accessories",price:349,tag:"NEW",image:"https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=85"},
  {id:7,name:"Essential Hoodie",category:"Tops",price:1199,tag:"",image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85"},
  {id:8,name:"Utility Shorts",category:"Bottoms",price:799,tag:"",image:"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=700&q=85"}
];

// IMPORTANT: Replace with the store owner's WhatsApp number, digits only, including country code.
const STORE_WHATSAPP = "639000000000";
let cart = [];
const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const money = value => "₱" + value.toLocaleString("en-PH");

function renderProducts(category="All") {
  const visible = category === "All" ? products : products.filter(p => p.category === category);
  productGrid.innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
      </div>
      <div class="product-info">
        <div><h3>${p.name}</h3><p>${money(p.price)}</p></div>
        <button class="add-button" data-add="${p.id}">Add to bag +</button>
      </div>
    </article>`).join("");
}
function addToCart(id) {
  const item = cart.find(x => x.id === id);
  if (item) item.qty++;
  else cart.push({...products.find(p => p.id === id), qty:1});
  renderCart();
  showToast("Added to your bag");
}
function changeQty(id, amount) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  renderCart();
}
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(total);
  document.getElementById("cartItems").innerHTML = cart.length ? cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="">
      <div><h4>${item.name}</h4><p>${money(item.price)}</p>
        <div class="qty"><button data-qty="${item.id}" data-change="-1">−</button><span>${item.qty}</span><button data-qty="${item.id}" data-change="1">+</button></div>
      </div>
      <button class="remove" data-remove="${item.id}">Remove</button>
    </div>`).join("") : '<p class="empty-cart">Your bag is waiting for something good.</p>';
}
function openCart(open) {
  cartDrawer.classList.toggle("open", open);
  cartOverlay.classList.toggle("open", open);
  cartDrawer.setAttribute("aria-hidden", String(!open));
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}
document.getElementById("filters").addEventListener("click", e => {
  const button = e.target.closest("[data-category]");
  if (!button) return;
  document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  renderProducts(button.dataset.category);
});
productGrid.addEventListener("click", e => {
  const button = e.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
document.getElementById("cartItems").addEventListener("click", e => {
  const qty = e.target.closest("[data-qty]");
  const remove = e.target.closest("[data-remove]");
  if (qty) changeQty(Number(qty.dataset.qty), Number(qty.dataset.change));
  if (remove) { cart = cart.filter(x => x.id !== Number(remove.dataset.remove)); renderCart(); }
});
document.getElementById("cartToggle").addEventListener("click", () => openCart(true));
document.getElementById("closeCart").addEventListener("click", () => openCart(false));
cartOverlay.addEventListener("click", () => openCart(false));
document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a => a.addEventListener("click", () => document.getElementById("mainNav").classList.remove("open")));
function sendOrder() {
  if (!cart.length) { showToast("Your bag is empty"); return; }
  if (STORE_WHATSAPP === "639000000000") { showToast("Store owner: set your WhatsApp number in script.js"); return; }
  const lines = cart.map(item => `${item.qty} x ${item.name} - ${money(item.price * item.qty)}`);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const message = encodeURIComponent("Hello! I'd like to order:\n" + lines.join("\n") + "\nSubtotal: " + money(total) + "\nPlease confirm availability and delivery details.");
  window.open(`https://wa.me/${STORE_WHATSAPP}?text=${message}`, "_blank", "noopener");
}
document.getElementById("checkoutButton").addEventListener("click", sendOrder);
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();