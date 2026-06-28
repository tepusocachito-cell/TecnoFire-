/*================================================
  TECNOFIRE PRO v4.0 – app.js
  Versión limpia y profesional
================================================*/

"use strict";

/* ================================================
   1. DATOS Y ESTADO
================================================ */

const PRODUCTOS = [
  { id:1, nombre:"Laptop Gamer ASUS ROG",   precio:35000, categoria:"Laptop",  estrellas:5, badge:"Más vendido",
    imagen:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600" },
  { id:2, nombre:"Mouse Logitech MX Master", precio:1200,  categoria:"Mouse",   estrellas:5, badge:"Top rated",
    imagen:"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600" },
  { id:3, nombre:"Monitor Samsung 27\" 4K",  precio:9800,  categoria:"Monitor", estrellas:4, badge:"",
    imagen:"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600" },
  { id:4, nombre:"Teclado Mecánico Corsair", precio:2200,  categoria:"Teclado", estrellas:4, badge:"Nuevo",
    imagen:"https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600" },
  { id:5, nombre:"SSD Kingston NV3 2TB",     precio:4200,  categoria:"Disco",   estrellas:5, badge:"Oferta",
    imagen:"https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600" },
  { id:6, nombre:"Auriculares HyperX Cloud", precio:2800,  categoria:"Audio",   estrellas:5, badge:"",
    imagen:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600" },
  { id:7, nombre:"iPhone 15 Pro 256GB",      precio:52000, categoria:"Celular", estrellas:5, badge:"Destacado",
    imagen:"https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600" },
  { id:8, nombre:"Webcam Logitech 4K Pro",   precio:3500,  categoria:"Audio",   estrellas:4, badge:"",
    imagen:"https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=600" },
];

let carrito    = JSON.parse(localStorage.getItem("tf_carrito"))    || [];
let favoritos  = JSON.parse(localStorage.getItem("tf_favoritos"))  || [];
let historial  = JSON.parse(localStorage.getItem("tf_historial"))  || [];
let usuario    = JSON.parse(localStorage.getItem("tf_usuario"))    || {
  nombre: "Administrador",
  correo: "admin@tecnofire.com",
  tel: "",
  foto: "https://i.pravatar.cc/150?img=3"
};

/* ================================================
   2. SELECTORES PRINCIPALES
================================================ */

const $ = id => document.getElementById(id);
const loader          = $("loader");
const sidebar         = $("sidebar");
const menuBtn         = $("menu");
const buscarInput     = $("buscar");
const limpiarBusq     = $("limpiarBusqueda");
const darkBtn         = $("darkButton");
const navItems        = document.querySelectorAll("#navList li");
const carritoPanel    = $("carritoPanel");
const carritoOverlay  = $("carritoOverlay");
const cerrarCarritoBtn= $("cerrarCarrito");
const listaCarritoEl  = $("listaCarrito");
const totalEl         = $("total");
const comprarBtn      = $("comprar");
const vaciarBtn       = $("vaciarCarrito");
const modalOverlay    = $("modalOverlay");
const modalCerrar     = $("modalCerrar");

/* ================================================
   3. LOADER
================================================ */

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 500);
  }, 1400);
});

/* ================================================
   4. MODO OSCURO
================================================ */

if (localStorage.getItem("tf_dark") === "true") {
  document.body.classList.add("dark");
}
darkBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("tf_dark", document.body.classList.contains("dark"));
};

/* ================================================
   5. SIDEBAR / MENÚ
================================================ */

menuBtn.onclick = () => {
  const isMobile = window.innerWidth <= 720;
  if (isMobile) {
    sidebar.classList.toggle("abierto");
  } else {
    sidebar.classList.toggle("mini");
    document.querySelector(".contenido").classList.toggle("expandir");
    $("reloj").style.left = sidebar.classList.contains("mini")
      ? "calc(72px + 20px)"
      : "calc(260px + 20px)";
  }
};

// Cerrar sidebar en móvil al hacer click fuera
document.addEventListener("click", e => {
  if (window.innerWidth <= 720 &&
      !sidebar.contains(e.target) &&
      !menuBtn.contains(e.target)) {
    sidebar.classList.remove("abierto");
  }
});

/* ================================================
   6. NAVEGACIÓN POR SECCIONES
================================================ */

function navegarSeccion(nombre) {
  // Ocultar todas
  document.querySelectorAll(".seccion").forEach(s => s.classList.remove("activa"));
  // Mostrar la solicitada
  const sec = $("sec-" + nombre);
  if (sec) sec.classList.add("activa");

  // Marcar nav activo
  navItems.forEach(li => {
    li.classList.toggle("active", li.dataset.seccion === nombre);
  });

  // Acciones por sección
  if (nombre === "productos") renderProductosGrid(PRODUCTOS);
  if (nombre === "favoritos") renderFavoritos();
  if (nombre === "dashboard") renderDashboard();
  if (nombre === "perfil")    renderPerfil();
  if (nombre === "carrito")   abrirCarrito();

  // Cerrar sidebar en móvil
  if (window.innerWidth <= 720) sidebar.classList.remove("abierto");
}

navItems.forEach(li => {
  li.onclick = () => navegarSeccion(li.dataset.seccion);
});

/* ================================================
   7. RENDER DE PRODUCTO (tarjeta)
================================================ */

function crearTarjetaProducto(p, modoFav = false) {
  const esFav = favoritos.some(f => f.id === p.id);
  const div = document.createElement("div");
  div.className = "producto";
  div.dataset.id = p.id;

  div.innerHTML = `
    <div class="producto-img-wrap">
      <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
      ${p.badge ? `<span class="producto-badge">${p.badge}</span>` : ""}
      <button class="btn-fav-flotante ${esFav ? "activo" : ""}" data-id="${p.id}" aria-label="Favorito">
        ${esFav ? "❤️" : "🤍"}
      </button>
    </div>
    <div class="producto-info">
      <h3>${p.nombre}</h3>
      <p class="producto-cat">${p.categoria}</p>
      <div class="estrellas">${"★".repeat(p.estrellas)}${"☆".repeat(5 - p.estrellas)}</div>
      <div class="precio">C$ ${p.precio.toLocaleString()}</div>
      ${modoFav
        ? `<button class="btn-carrito-full" data-id="${p.id}">
             <i class="fa-solid fa-cart-plus"></i> Agregar al carrito
           </button>`
        : `<button class="btn-carrito-full" data-id="${p.id}">
             <i class="fa-solid fa-cart-plus"></i> Agregar al carrito
           </button>`
      }
    </div>
  `;

  // Favorito
  div.querySelector(".btn-fav-flotante").onclick = e => {
    e.stopPropagation();
    toggleFavorito(p.id);
  };

  // Carrito
  div.querySelector(".btn-carrito-full").onclick = () => {
    agregarAlCarrito(p.id);
    // feedback visual
    const btn = div.querySelector(".btn-carrito-full");
    btn.classList.add("agregado");
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
    setTimeout(() => {
      btn.classList.remove("agregado");
      btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar al carrito';
    }, 1500);
  };

  return div;
}

/* ================================================
   8. INICIO – PRODUCTOS DESTACADOS
================================================ */

function renderDestacados() {
  const cont = $("productosDestacados");
  cont.innerHTML = "";
  PRODUCTOS.slice(0, 4).forEach(p => cont.appendChild(crearTarjetaProducto(p)));
}
renderDestacados();

/* ================================================
   9. SECCIÓN PRODUCTOS
================================================ */

function renderProductosGrid(lista) {
  const cont = $("productosGrid");
  const sinRes = $("sinResultados");
  const resInfo = $("resultadosBusqueda");
  cont.innerHTML = "";

  if (lista.length === 0) {
    sinRes.classList.remove("hidden");
    resInfo.classList.add("hidden");
    return;
  }
  sinRes.classList.add("hidden");

  if (buscarInput.value.trim() || $("filtroCategoria").value) {
    resInfo.textContent = `${lista.length} resultado${lista.length > 1 ? "s" : ""} encontrado${lista.length > 1 ? "s" : ""}`;
    resInfo.classList.remove("hidden");
  } else {
    resInfo.classList.add("hidden");
  }

  lista.forEach(p => cont.appendChild(crearTarjetaProducto(p)));
}

function limpiarFiltros() {
  buscarInput.value = "";
  $("filtroCategoria").value = "";
  $("filtroOrden").value = "";
  limpiarBusq.classList.add("hidden");
  renderProductosGrid(PRODUCTOS);
}

function filtrarYOrdenar() {
  const texto = buscarInput.value.toLowerCase().trim();
  const cat   = $("filtroCategoria").value;
  const orden = $("filtroOrden").value;

  let lista = PRODUCTOS.filter(p => {
    const matchTexto = !texto || p.nombre.toLowerCase().includes(texto) || p.categoria.toLowerCase().includes(texto);
    const matchCat   = !cat   || p.categoria === cat;
    return matchTexto && matchCat;
  });

  if (orden === "precio-asc")  lista.sort((a,b) => a.precio - b.precio);
  if (orden === "precio-desc") lista.sort((a,b) => b.precio - a.precio);
  if (orden === "nombre")      lista.sort((a,b) => a.nombre.localeCompare(b.nombre));

  renderProductosGrid(lista);
}

// Buscador
buscarInput.addEventListener("input", () => {
  limpiarBusq.classList.toggle("hidden", !buscarInput.value);
  // Filtrar en la sección activa
  const secActiva = document.querySelector(".seccion.activa");
  if (secActiva && secActiva.id === "sec-productos") {
    filtrarYOrdenar();
  }
  // También filtrar en inicio (busqueda global)
  const texto = buscarInput.value.toLowerCase().trim();
  if (texto) {
    navegarSeccion("productos");
    filtrarYOrdenar();
  }
});
limpiarBusq.onclick = () => {
  buscarInput.value = "";
  limpiarBusq.classList.add("hidden");
  filtrarYOrdenar();
};
$("filtroCategoria").addEventListener("change", filtrarYOrdenar);
$("filtroOrden").addEventListener("change", filtrarYOrdenar);

// Categorías en inicio
document.querySelectorAll(".categoria").forEach(cat => {
  cat.onclick = () => {
    const catVal = cat.dataset.cat;
    navegarSeccion("productos");
    $("filtroCategoria").value = catVal;
    filtrarYOrdenar();
  };
});

/* ================================================
   10. CARRITO
================================================ */

function guardarCarrito() {
  localStorage.setItem("tf_carrito", JSON.stringify(carrito));
  renderCarrito();
  actualizarContadores();
  actualizarEstadisticas();
}

function agregarAlCarrito(id) {
  const prod = PRODUCTOS.find(p => p.id === id);
  if (!prod) return;

  const existente = carrito.find(item => item.id === id);
  if (existente) {
    existente.cantidad = (existente.cantidad || 1) + 1;
  } else {
    carrito.push({ ...prod, cantidad: 1 });
  }
  guardarCarrito();
  toast(`${prod.nombre} agregado al carrito 🛒`);
}

function renderCarrito() {
  listaCarritoEl.innerHTML = "";

  if (carrito.length === 0) {
    listaCarritoEl.innerHTML = `
      <div class="carrito-vacio">
        <i class="fa-solid fa-cart-shopping"></i>
        <p>Tu carrito está vacío</p>
      </div>`;
    totalEl.textContent = "C$0";
    return;
  }

  let suma = 0;
  carrito.forEach((item, idx) => {
    suma += item.precio * (item.cantidad || 1);
    const div = document.createElement("div");
    div.className = "item-carrito";
    div.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}">
      <div class="item-carrito-info">
        <h4>${item.nombre}</h4>
        <p>C$ ${item.precio.toLocaleString()}</p>
        <div class="item-carrito-qty">
          <button class="qty-btn" data-action="menos" data-idx="${idx}">−</button>
          <span class="qty-num">${item.cantidad || 1}</span>
          <button class="qty-btn" data-action="mas" data-idx="${idx}">+</button>
        </div>
      </div>
      <button class="btn-eliminar-item" data-idx="${idx}" aria-label="Eliminar">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    listaCarritoEl.appendChild(div);
  });

  totalEl.textContent = `C$ ${suma.toLocaleString()}`;

  // Eventos cantidad y eliminar
  listaCarritoEl.querySelectorAll(".qty-btn").forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.idx);
      if (btn.dataset.action === "mas") {
        carrito[idx].cantidad = (carrito[idx].cantidad || 1) + 1;
      } else {
        carrito[idx].cantidad = (carrito[idx].cantidad || 1) - 1;
        if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
      }
      guardarCarrito();
    };
  });
  listaCarritoEl.querySelectorAll(".btn-eliminar-item").forEach(btn => {
    btn.onclick = () => {
      carrito.splice(parseInt(btn.dataset.idx), 1);
      guardarCarrito();
    };
  });
}

function abrirCarrito() {
  carritoPanel.classList.add("activo");
  carritoOverlay.classList.add("activo");
}
function cerrarCarritoFn() {
  carritoPanel.classList.remove("activo");
  carritoOverlay.classList.remove("activo");
}

cerrarCarritoBtn.onclick = cerrarCarritoFn;
carritoOverlay.onclick   = cerrarCarritoFn;
$("navCarrito").onclick   = abrirCarrito;

vaciarBtn.onclick = () => {
  if (carrito.length === 0) return;
  if (confirm("¿Vaciar el carrito?")) {
    carrito = [];
    guardarCarrito();
    toast("Carrito vaciado");
  }
};

// Finalizar compra
comprarBtn.onclick = () => {
  if (carrito.length === 0) {
    toast("El carrito está vacío", "⚠️");
    return;
  }

  const total = carrito.reduce((s, i) => s + i.precio * (i.cantidad || 1), 0);
  const items = carrito.length;

  // Guardar en historial
  historial.unshift({
    fecha: new Date().toLocaleDateString("es-NI"),
    items,
    total,
    productos: carrito.map(c => c.nombre)
  });
  localStorage.setItem("tf_historial", JSON.stringify(historial));

  // Mostrar modal
  $("modalStats").innerHTML = `
    <strong>Productos:</strong> ${items} ítem${items > 1 ? "s" : ""}<br>
    <strong>Total pagado:</strong> C$ ${total.toLocaleString()}<br>
    <strong>Fecha:</strong> ${new Date().toLocaleDateString("es-NI")}
  `;
  modalOverlay.classList.add("activo");

  carrito = [];
  guardarCarrito();
  cerrarCarritoFn();
};

modalCerrar.onclick = () => modalOverlay.classList.remove("activo");

/* ================================================
   11. FAVORITOS
================================================ */

function toggleFavorito(id) {
  const prod = PRODUCTOS.find(p => p.id === id);
  const idx  = favoritos.findIndex(f => f.id === id);

  if (idx >= 0) {
    favoritos.splice(idx, 1);
    toast(`${prod.nombre} eliminado de favoritos`, "💔");
  } else {
    favoritos.push(prod);
    toast(`${prod.nombre} agregado a favoritos ❤️`);
  }
  localStorage.setItem("tf_favoritos", JSON.stringify(favoritos));
  actualizarContadores();

  // Actualizar botones en pantalla
  document.querySelectorAll(`.btn-fav-flotante[data-id="${id}"]`).forEach(btn => {
    const esFav = favoritos.some(f => f.id === id);
    btn.classList.toggle("activo", esFav);
    btn.textContent = esFav ? "❤️" : "🤍";
  });

  // Re-render si estamos en favoritos
  const secActiva = document.querySelector(".seccion.activa");
  if (secActiva && secActiva.id === "sec-favoritos") renderFavoritos();
}

function renderFavoritos() {
  const cont  = $("productosFavoritos");
  const vacio = $("favoritosVacio");
  cont.innerHTML = "";

  if (favoritos.length === 0) {
    vacio.classList.remove("hidden");
    return;
  }
  vacio.classList.add("hidden");
  favoritos.forEach(p => cont.appendChild(crearTarjetaProducto(p, true)));
}

$("limpiarFavoritos").onclick = () => {
  if (favoritos.length === 0) return;
  if (confirm("¿Eliminar todos los favoritos?")) {
    favoritos = [];
    localStorage.setItem("tf_favoritos", JSON.stringify(favoritos));
    actualizarContadores();
    renderFavoritos();
    toast("Favoritos eliminados");
  }
};

/* ================================================
   12. CONTADORES DE SIDEBAR
================================================ */

function actualizarContadores() {
  const totalItems = carrito.reduce((s, i) => s + (i.cantidad || 1), 0);

  const cBadge = $("contadorCarrito");
  cBadge.textContent = totalItems;
  cBadge.classList.toggle("hidden", totalItems === 0);
  if (totalItems > 0) { cBadge.classList.add("pulse"); setTimeout(() => cBadge.classList.remove("pulse"), 400); }

  const fBadge = $("contadorFavoritos");
  fBadge.textContent = favoritos.length;
  fBadge.classList.toggle("hidden", favoritos.length === 0);
}

/* ================================================
   13. ESTADÍSTICAS
================================================ */

function actualizarEstadisticas() {
  $("productosTotal").textContent = PRODUCTOS.length;
  $("ventasTotal").textContent    = "248";
  $("clientesTotal").textContent  = "132";

  const ganancias = PRODUCTOS.reduce((s, p) => s + p.precio, 0);
  $("gananciasTotal").textContent = "C$ " + ganancias.toLocaleString();
}
actualizarEstadisticas();

/* ================================================
   14. DASHBOARD
================================================ */

function renderDashboard() {
  $("dash-productos").textContent = PRODUCTOS.length;

  const totalItems = carrito.reduce((s,i) => s + (i.cantidad||1), 0);
  $("dash-carrito").textContent = totalItems;

  const valorCarrito = carrito.reduce((s,i) => s + i.precio*(i.cantidad||1), 0);
  $("dash-valor").textContent = "C$ " + valorCarrito.toLocaleString();

  $("dash-favoritos").textContent = favoritos.length;

  // Tabla
  const tbody = $("dashTabla");
  tbody.innerHTML = "";
  PRODUCTOS.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${p.nombre}</strong></td>
      <td><span class="badge-cat">${p.categoria}</span></td>
      <td>C$ ${p.precio.toLocaleString()}</td>
      <td><span class="badge-activo">Activo</span></td>
    `;
    tbody.appendChild(tr);
  });
}

/* ================================================
   15. PERFIL
================================================ */

function renderPerfil() {
  $("perfilNombre").textContent  = usuario.nombre;
  $("perfilCorreo").textContent  = usuario.correo;
  $("perfilFoto").src            = usuario.foto;
  $("nombreHeader").textContent  = usuario.nombre;
  $("correoHeader").textContent  = usuario.correo;
  $("fotoHeader").src            = usuario.foto;
  $("inputNombre").value = usuario.nombre;
  $("inputCorreo").value = usuario.correo;
  $("inputTel").value    = usuario.tel || "";

  // Historial
  const cont = $("historialCompras");
  cont.innerHTML = "";
  if (historial.length === 0) {
    cont.innerHTML = '<p class="texto-vacio">No hay compras registradas aún.</p>';
    return;
  }
  historial.slice(0, 8).forEach(h => {
    const div = document.createElement("div");
    div.className = "historial-item";
    div.innerHTML = `
      <div>
        <strong>${h.items} producto${h.items > 1 ? "s" : ""}</strong>
        <span class="historial-fecha">${h.fecha}</span>
      </div>
      <span class="historial-monto">C$ ${h.total.toLocaleString()}</span>
    `;
    cont.appendChild(div);
  });
}

// Guardar perfil
$("guardarPerfil").onclick = () => {
  usuario.nombre = $("inputNombre").value.trim() || usuario.nombre;
  usuario.correo = $("inputCorreo").value.trim() || usuario.correo;
  usuario.tel    = $("inputTel").value.trim();
  localStorage.setItem("tf_usuario", JSON.stringify(usuario));
  renderPerfil();
  toast("Perfil actualizado ✅");
};

// Cambiar foto
$("inputFoto").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    usuario.foto = ev.target.result;
    localStorage.setItem("tf_usuario", JSON.stringify(usuario));
    renderPerfil();
    toast("Foto actualizada");
  };
  reader.readAsDataURL(file);
});

/* ================================================
   16. PERFIL EN HEADER
================================================ */

function cargarHeader() {
  $("nombreHeader").textContent = usuario.nombre;
  $("correoHeader").textContent = usuario.correo;
  $("fotoHeader").src           = usuario.foto;
}
cargarHeader();

$("btnNotif").onclick = () => toast("No tienes nuevas notificaciones", "🔔");

/* ================================================
   17. TOAST (NOTIFICACIONES)
================================================ */

function toast(mensaje, icono = "✅") {
  const cont = $("toastContainer");
  const div  = document.createElement("div");
  div.className = "toast";
  div.innerHTML = `<span class="toast-icon">${icono}</span>${mensaje}`;
  cont.appendChild(div);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => div.classList.add("mostrar"));
  });
  setTimeout(() => {
    div.classList.remove("mostrar");
    setTimeout(() => div.remove(), 400);
  }, 2800);
}

/* ================================================
   18. RELOJ
================================================ */

function actualizarReloj() {
  const ahora = new Date();
  $("reloj").textContent = ahora.toLocaleTimeString("es-NI", { hour:"2-digit", minute:"2-digit", second:"2-digit" });
}
actualizarReloj();
setInterval(actualizarReloj, 1000);

/* ================================================
   19. INIT – render inicial
================================================ */

renderCarrito();
actualizarContadores();
