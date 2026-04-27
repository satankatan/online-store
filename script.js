// ========== СИНХРОНИЗАЦИЯ КОРЗИНЫ С СЕРВЕРОМ ==========
// Это единственное изменение, которое нужно добавить в фронт!

// Функция сохранения корзины на сервер
async function syncCartToServer() {
    try {
        const cartData = localStorage.getItem('shop.cart');
        if (cartData) {
            await fetch('http://localhost:8000/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: cartData
            });
        }
    } catch (error) {
        console.log('Синхронизация не удалась, работаем локально');
    }
}

// Функция загрузки корзины с сервера
async function loadCartFromServer() {
    try {
        const response = await fetch('http://localhost:8000/api/cart');
        if (response.ok) {
            const data = await response.json();
            if (data.cart && data.cart.length) {
                localStorage.setItem('shop.cart', JSON.stringify(data.cart));
                // Обновляем отображение корзины
                if (window.renderCart) window.renderCart();
                if (window.updateCartCount) window.updateCartCount();
            }
        }
    } catch (error) {
        console.log('Загрузка с сервера не удалась, работаем локально');
    }
}

// Перехватываем сохранение в localStorage
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (key === 'shop.cart') {
        syncCartToServer();
    }
};

// Загружаем корзину с сервера при старте
loadCartFromServer();

// Сохраняем при закрытии страницы
window.addEventListener('beforeunload', () => {
    const cartData = localStorage.getItem('shop.cart');
    if (cartData) {
        navigator.sendBeacon('http://localhost:8000/api/cart', cartData);
    }
});

function encodeSvg(svg) {
  // Базируем на base64, чтобы SVG-данные надежно работали в Safari/части браузеров.
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

function productImage(kind, accent, label) {
  const safeLabel = label.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const bg = `
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${accent}" stop-opacity="0.20" />
        <stop offset="1" stop-color="#160a27" stop-opacity="0.25" />
      </linearGradient>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#2b163f" flood-opacity="0.25" />
      </filter>
    </defs>
    <rect width="900" height="900" rx="52" fill="url(#g)" />
  `;

  let figure = "";
  const stroke = accent;
  const fill = "rgba(255,255,255,0.88)";

  switch (kind) {
    case "coat":
      figure = `
        <g filter="url(#s)">
          <path d="M380 160 L520 160 L600 330 L565 760 Q450 820 335 760 L300 330 Z" fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <path d="M450 160 L450 760" stroke="${stroke}" stroke-width="10" opacity="0.55" />
          <path d="M520 160 L585 255" stroke="${stroke}" stroke-width="10" opacity="0.7" />
          <path d="M380 160 L315 255" stroke="${stroke}" stroke-width="10" opacity="0.7" />
          <rect x="420" y="420" width="60" height="30" rx="10" fill="${accent}" opacity="0.25" />
        </g>
      `;
      break;
    case "puffer":
      figure = `
        <g filter="url(#s)">
          <path d="M355 210 Q450 150 545 210 L585 330 Q545 430 565 520 Q520 740 450 780 Q380 740 335 520 Q355 430 315 330 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <path d="M320 350 Q450 420 580 350" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.5" />
          <path d="M320 450 Q450 520 580 450" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.4" />
        </g>
      `;
      break;
    case "trench":
      figure = `
        <g filter="url(#s)">
          <path d="M390 155 H510 L600 330 L545 770 Q450 820 355 770 L300 330 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <path d="M450 210 L450 680" stroke="${stroke}" stroke-width="10" opacity="0.5" />
          <path d="M360 330 Q450 370 540 330" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.65" />
          <rect x="395" y="515" width="110" height="34" rx="14" fill="${accent}" opacity="0.25" stroke="${stroke}" stroke-width="6" />
        </g>
      `;
      break;
    case "denimjacket":
      figure = `
        <g filter="url(#s)">
          <path d="M390 160 H510 L600 320 L565 760 Q450 820 335 760 L300 320 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <path d="M450 160 L450 760" stroke="${stroke}" stroke-width="10" opacity="0.35" />
          <rect x="315" y="390" width="70" height="50" rx="12" fill="${accent}" opacity="0.20" stroke="${stroke}" stroke-width="6" />
          <rect x="515" y="390" width="70" height="50" rx="12" fill="${accent}" opacity="0.20" stroke="${stroke}" stroke-width="6" />
          <path d="M340 590 Q450 650 560 590" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.35" />
        </g>
      `;
      break;
    case "bomber":
      figure = `
        <g filter="url(#s)">
          <path d="M360 200 Q450 140 540 200 L590 340 Q520 420 540 520 Q500 740 450 760 Q400 740 360 520 Q380 420 310 340 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <path d="M400 250 Q450 220 500 250" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.55" />
          <rect x="405" y="650" width="90" height="30" rx="14" fill="${accent}" opacity="0.25" stroke="${stroke}" stroke-width="6" />
        </g>
      `;
      break;
    case "hoodie":
      figure = `
        <g filter="url(#s)">
          <path d="M395 260 Q450 200 505 260 L560 390 Q540 470 555 560 Q520 745 450 780 Q380 745 345 560 Q360 470 340 390 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <path d="M450 200 Q410 230 385 270" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.55" />
          <path d="M450 200 Q490 230 515 270" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.55" />
          <rect x="410" y="560" width="80" height="42" rx="16" fill="${accent}" opacity="0.20" stroke="${stroke}" stroke-width="6" />
          <path d="M430 360 L470 360" stroke="${stroke}" stroke-width="8" opacity="0.55" />
        </g>
      `;
      break;
    case "tshirt":
      figure = `
        <g filter="url(#s)">
          <path d="M380 260 L430 230 Q450 215 470 230 L520 260 L575 370 L530 760 Q450 815 370 760 L425 370 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <path d="M430 230 Q450 420 470 230" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.55" />
          <rect x="410" y="470" width="80" height="40" rx="14" fill="${accent}" opacity="0.18" stroke="${stroke}" stroke-width="6" />
        </g>
      `;
      break;
    case "shirt":
      figure = `
        <g filter="url(#s)">
          <path d="M385 230 L450 195 L515 230 L580 360 L540 780 Q450 835 360 780 L420 360 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <path d="M450 195 L450 360" stroke="${stroke}" stroke-width="10" opacity="0.45" />
          <path d="M385 230 Q450 280 515 230" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.65" />
          <rect x="430" y="520" width="40" height="22" rx="10" fill="${accent}" opacity="0.22" />
          <rect x="430" y="555" width="40" height="22" rx="10" fill="${accent}" opacity="0.22" />
        </g>
      `;
      break;
    case "knit":
      figure = `
        <g filter="url(#s)">
          <path d="M400 210 H500 L560 350 L520 770 Q450 815 380 770 L340 350 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <path d="M360 370 Q450 430 540 370" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.35" />
          <path d="M420 320 L480 320" stroke="${stroke}" stroke-width="10" opacity="0.55" />
          <path d="M410 420 Q450 460 490 420" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.35" />
        </g>
      `;
      break;
    case "jeans":
      figure = `
        <g filter="url(#s)">
          <path d="M380 260 Q450 230 520 260 L580 760 Q450 825 320 760 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <rect x="360" y="390" width="180" height="80" rx="24" fill="${accent}" opacity="0.16" stroke="${stroke}" stroke-width="6" />
          <path d="M450 260 L450 820" stroke="${stroke}" stroke-width="10" opacity="0.28" />
          <path d="M340 550 Q450 610 560 550" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.25" />
        </g>
      `;
      break;
    case "trousers":
      figure = `
        <g filter="url(#s)">
          <path d="M385 250 Q450 220 515 250 L585 770 Q450 835 315 770 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <path d="M450 250 L450 820" stroke="${stroke}" stroke-width="10" opacity="0.35" />
          <rect x="390" y="390" width="120" height="55" rx="22" fill="${accent}" opacity="0.16" stroke="${stroke}" stroke-width="6" />
        </g>
      `;
      break;
    case "skirt":
      figure = `
        <g filter="url(#s)">
          <path d="M405 260 Q450 225 495 260 L575 760 Q450 840 325 760 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <rect x="405" y="250" width="90" height="46" rx="18" fill="${accent}" opacity="0.18" stroke="${stroke}" stroke-width="6" />
          <path d="M375 520 Q450 560 525 520" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.3" />
        </g>
      `;
      break;
    case "shorts":
      figure = `
        <g filter="url(#s)">
          <path d="M405 290 Q450 260 495 290 L560 760 Q450 830 340 760 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <rect x="408" y="270" width="84" height="44" rx="18" fill="${accent}" opacity="0.18" stroke="${stroke}" stroke-width="6" />
          <path d="M450 260 L450 820" stroke="${stroke}" stroke-width="10" opacity="0.25" />
        </g>
      `;
      break;
    case "sneakers":
      figure = `
        <g filter="url(#s)">
          <path d="M250 610 Q390 540 520 580 L620 630 Q580 720 450 740 Q330 730 220 660 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <path d="M360 580 Q410 520 470 510 Q510 500 540 520" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.55" />
          <rect x="330" y="610" width="70" height="40" rx="14" fill="${accent}" opacity="0.20" stroke="${stroke}" stroke-width="6" />
        </g>
      `;
      break;
    case "loafers":
      figure = `
        <g filter="url(#s)">
          <path d="M260 610 Q380 560 520 585 Q625 605 680 665 Q620 745 470 740 Q330 730 230 670 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <path d="M370 625 Q450 585 535 625" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.45" />
          <rect x="420" y="640" width="70" height="30" rx="12" fill="${accent}" opacity="0.18" stroke="${stroke}" stroke-width="6" />
        </g>
      `;
      break;
    case "chelsea":
      figure = `
        <g filter="url(#s)">
          <path d="M420 310 Q450 290 480 310 L520 360 L520 780 Q450 820 380 780 L380 360 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <rect x="395" y="420" width="110" height="60" rx="22" fill="${accent}" opacity="0.18" stroke="${stroke}" stroke-width="6" />
          <path d="M450 310 L450 780" stroke="${stroke}" stroke-width="10" opacity="0.30" />
        </g>
      `;
      break;
    case "sandals":
      figure = `
        <g filter="url(#s)">
          <path d="M260 650 Q370 590 500 610 Q630 630 690 700 Q610 760 470 765 Q330 760 220 705 Z"
            fill="${fill}" stroke="${stroke}" stroke-width="10" />
          <path d="M350 640 Q430 560 520 600" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.55" />
          <path d="M420 620 Q450 590 480 620" fill="none" stroke="${stroke}" stroke-width="10" opacity="0.55" />
          <rect x="375" y="620" width="60" height="22" rx="10" fill="${accent}" opacity="0.20" />
        </g>
      `;
      break;
    default:
      figure = `
        <g filter="url(#s)">
          <rect x="300" y="200" width="300" height="520" rx="80" fill="${fill}" stroke="${stroke}" stroke-width="10" />
        </g>
      `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
      ${bg}
      ${figure}
      <g opacity="0.85">
        <rect x="80" y="740" width="740" height="80" rx="28" fill="rgba(255,255,255,0.72)" stroke="rgba(255,255,255,0.55)" />
        <text x="450" y="792" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="#1b1b1f">${safeLabel}</text>
      </g>
    </svg>
  `;

  return encodeSvg(svg);
}

const products = [
  {
    id: 1,
    name: "Пальто Oversize Wool",
    category: "outerwear",
    price: 14990,
    rating: 4.8,
    badge: "-20%",
    desc: "Теплое шерстяное пальто свободного силуэта для холодного сезона.",
    image: "./assets/coat.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Черный", "Графит", "Кремовый"]
  },
  {
    id: 2,
    name: "Куртка Urban Puffer",
    category: "outerwear",
    price: 11990,
    rating: 4.7,
    badge: "Хит",
    desc: "Легкая стеганая куртка с ветрозащитой и объемным воротом.",
    image: "./assets/puffer.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Черный", "Молочный", "Олива"]
  },
  {
    id: 3,
    name: "Тренч Modern Belt",
    category: "outerwear",
    price: 9990,
    rating: 4.6,
    badge: "Limited",
    desc: "Тренч с поясом и аккуратными линиями для городских маршрутов.",
    image: "./assets/trench.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Бежевый", "Темно-синий", "Кремовый"]
  },
  {
    id: 4,
    name: "Джинсовка Denim Stitch",
    category: "outerwear",
    price: 7490,
    rating: 4.7,
    badge: "Новинка",
    desc: "Джинсовая куртка с контрастными швами и карманами-акцентами.",
    image: "./assets/denimjacket.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Голубой деним", "Индиго", "Серый"]
  },
  {
    id: 5,
    name: "Бомбер City Air",
    category: "outerwear",
    price: 8590,
    rating: 4.5,
    badge: "Хит",
    desc: "Легкий бомбер для межсезонья: удобный, свободный, дышащий.",
    image: "./assets/bomber.webp",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Черный", "Серый", "Карамель"]
  },
  {
    id: 6,
    name: "Худи Minimal Beige",
    category: "tops",
    price: 4990,
    rating: 4.9,
    badge: "Новинка",
    desc: "Базовое худи из плотного хлопка с мягкой изнанкой.",
    image: "./assets/hoodie.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Бежевый", "Белый", "Графит"]
  },
  {
    id: 7,
    name: "Футболка Clean Tee",
    category: "tops",
    price: 1990,
    rating: 4.6,
    badge: "Easy",
    desc: "Тиcет из хлопка: ровная посадка и комфорт на каждый день.",
    image: "./assets/tshirt.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Белый", "Черный", "Песочный"]
  },
  {
    id: 8,
    name: "Рубашка Linen Sky",
    category: "tops",
    price: 4290,
    rating: 4.6,
    badge: "Limited",
    desc: "Льняная рубашка свободного кроя для летних образов.",
    image: "./assets/shirt.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Небесный", "Белый", "Песочный"]
  },
  {
    id: 9,
    name: "Джемпер Knit Rib",
    category: "tops",
    price: 5390,
    rating: 4.7,
    badge: "-10%",
    desc: "Вязаный джемпер с мягкой фактурой и эластичными манжетами.",
    image: "./assets/jumper.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Графит", "Кремовый", "Темно-синий"]
  },
  {
    id: 10,
    name: "Платье-рубашка Soft Line",
    category: "tops",
    price: 7990,
    rating: 4.8,
    badge: "Топ",
    desc: "Платье с воротником и пуговицами — легко комбинируется с обувью.",
    image: "./assets/shirtdress.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Белый", "Песочный", "Голубой"]
  },
  {
    id: 11,
    name: "Джинсы Wide Leg",
    category: "bottoms",
    price: 5590,
    rating: 4.8,
    badge: "-15%",
    desc: "Джинсы с высокой посадкой и широкими штанинами.",
    image: "./assets/jeans.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Голубой деним", "Индиго", "Черный"]
  },
  {
    id: 12,
    name: "Брюки Tailored Fit",
    category: "bottoms",
    price: 6390,
    rating: 4.7,
    badge: "Premium",
    desc: "Классические брюки прямого кроя из костюмной ткани.",
    image: "./assets/trousers.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Черный", "Графит", "Темно-синий"]
  },
  {
    id: 13,
    name: "Шорты Urban Chill",
    category: "bottoms",
    price: 3690,
    rating: 4.5,
    badge: "Лето",
    desc: "Шорты с аккуратной посадкой и легкой тканью для жарких дней.",
    image: "./assets/shorts.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Песочный", "Черный", "Олива"]
  },
  {
    id: 14,
    name: "Юбка Midi Flow",
    category: "bottoms",
    price: 4590,
    rating: 4.6,
    badge: "Новинка",
    desc: "Юбка миди с плавной линией и комфортной талией.",
    image: "./assets/skirt.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Черный", "Кремовый", "Бордовый"]
  },
  {
    id: 15,
    name: "Кеды Street White",
    category: "shoes",
    price: 7290,
    rating: 4.9,
    badge: "Топ",
    desc: "Белые городские кеды с мягкой стелькой и комфортом на весь день.",
    image: "./assets/sneakers.jpg",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["Белый", "Молочный", "Серый"]
  },
  {
    id: 16,
    name: "Лоферы Modern Loafer",
    category: "shoes",
    price: 8490,
    rating: 4.6,
    badge: "Premium",
    desc: "Лоферы с аккуратной формой и удобной колодкой.",
    image: "./assets/loafers.jpg",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["Черный", "Карамель", "Шоколад"]
  },
  {
    id: 17,
    name: "Ботинки Chelsea",
    category: "shoes",
    price: 8990,
    rating: 4.7,
    badge: "Осень",
    desc: "Минималистичные ботинки с эластичными вставками и устойчивой подошвой.",
    image: "./assets/chelsea.jpg",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["Черный", "Шоколад"]
  },
  {
    id: 18,
    name: "Сандалии Summer Slide",
    category: "shoes",
    price: 3990,
    rating: 4.4,
    badge: "-5%",
    desc: "Легкие сандалии для прогулок: продуманная посадка и мягкая стелька.",
    image: "./assets/sandals.jpg",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["Белый", "Песочный", "Черный"]
  }
];

let currentFilter = "all";
let searchTerm = "";
let selectedProductId = null;

const state = {
  cart: JSON.parse(localStorage.getItem("shop.cart") || "[]"),
  user: JSON.parse(localStorage.getItem("shop.user") || "null")
};

const pages = [...document.querySelectorAll(".page")];
const productsGrid = document.getElementById("productsGrid");
const productDetails = document.getElementById("productDetails");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const profileCard = document.getElementById("profileCard");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutMessage = document.getElementById("checkoutMessage");
const checkoutForm = document.getElementById("checkoutForm");
const orderNumberEl = document.getElementById("orderNumber");
const orderMetaEl = document.getElementById("orderMeta");

function saveState() {
  localStorage.setItem("shop.cart", JSON.stringify(state.cart));
  localStorage.setItem("shop.user", JSON.stringify(state.user));
}

function route() {
  const id = (location.hash || "#home").slice(1);
  pages.forEach((page) => page.classList.toggle("active", page.id === id));
  if (id === "catalog") renderCatalog();
  if (id === "product") renderProduct();
  if (id === "cart") renderCart();
  if (id === "profile") renderProfile();
  if (id === "checkout") renderCheckout();
  if (id === "orderSuccess") renderOrderSuccess();
}

function filteredProducts() {
  return products.filter((p) => {
    const byCategory = currentFilter === "all" || p.category === currentFilter;
    const bySearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return byCategory && bySearch;
  });
}

function renderCatalog() {
  const list = filteredProducts();
  if (!list.length) {
    productsGrid.innerHTML = "<p>Товары не найдены.</p>";
    return;
  }
  productsGrid.innerHTML = list
    .map(
      (p) => `
      <article class="product-card">
        <img class="product-image" src="${p.image}" alt="${p.name}" />
        <div class="product-top">
          <span class="chip">${p.badge}</span>
          <span class="rating">★ ${p.rating}</span>
        </div>
        <h3>${p.name}</h3>
        <p class="meta">${labelByCategory(p.category)}</p>
        <p class="meta">${p.desc}</p>
        <p class="meta"><strong>Размеры:</strong> ${p.sizes ? p.sizes.join(", ") : "—"}</p>
        <p class="price">${formatPrice(p.price)}</p>
        <button class="btn" data-open="${p.id}">Подробнее</button>
        <button class="btn" data-add="${p.id}">В корзину</button>
      </article>
    `
    )
    .join("");
}

function labelByCategory(category) {
  return {
    outerwear: "Верхняя одежда",
    tops: "Верх",
    bottoms: "Низ",
    shoes: "Обувь"
  }[category];
}

function renderProduct() {
  const product = products.find((p) => p.id === selectedProductId);
  if (!product) {
    productDetails.innerHTML = "<p>Товар не выбран.</p>";
    return;
  }

  const sizes =
    product.sizes ||
    (product.category === "shoes"
      ? ["36", "37", "38", "39", "40", "41"]
      : ["XS", "S", "M", "L", "XL"]);
  const colors = product.colors || ["Черный", "Белый", "Бежевый"];

  const materialsByCategory = {
    outerwear: "шерсть/смесовые ткани, подкладка премиум‑класса",
    tops: "хлопок/лён/вискоза",
    bottoms: "костюмные ткани и деним",
    shoes: "эко‑кожа/текстиль + мягкая стелька"
  };

  const careByCategory = {
    outerwear: "рекомендуем бережную чистку и проветривание",
    tops: "стирка по ярлыку, деликатный режим",
    bottoms: "стирка в холодной воде, не отбеливать",
    shoes: "очистка мягкой щеткой и влажной салфеткой"
  };

  const defaultSize = sizes[0];
  const defaultColor = colors[0];

  productDetails.innerHTML = `
    <div class="product-layout">
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="product-buy">
        <h2>${product.name}</h2>
        <div class="kpi-row">
          <span class="kpi">★ ${product.rating}</span>
          <span class="kpi">${product.badge}</span>
          <span class="kpi">${labelByCategory(product.category)}</span>
          <span class="kpi">Доставка 1–3 дня</span>
        </div>
        <p class="meta">${product.desc}</p>
        <p class="price">${formatPrice(product.price)}</p>

        <div class="option-group">
          <div class="option-title">
            <strong>Размер</strong>
            <span class="muted">подсказка: см. таблицу ниже</span>
          </div>
          <div class="size-grid" id="sizeGrid">
            ${sizes.map((s) => `<button type="button" class="size-btn${s === defaultSize ? " active" : ""}" data-size="${s}">${s}</button>`).join("")}
          </div>
          <div class="size-hint" id="selectedSizeHint">Выбран размер: <strong>${defaultSize}</strong></div>
        </div>

        <div class="option-group">
          <div class="option-title">
            <strong>Цвет</strong>
            <span class="muted">выберите оттенок</span>
          </div>
          <div class="chips" id="colorChips">
            ${colors.map((c) => `<button type="button" class="chip-btn${c === defaultColor ? " active" : ""}" data-color="${c}">${c}</button>`).join("")}
          </div>
          <div class="size-hint" id="selectedColorHint">Выбран цвет: <strong>${defaultColor}</strong></div>
        </div>

        <button class="btn" id="addFromDetails">Добавить в корзину</button>

        <div class="product-sections">
          <details open>
            <summary>Доставка и возврат</summary>
            <p class="muted">Доставка 1–3 дня. Возврат и обмен — в течение 7 дней при сохранении товарного вида.</p>
          </details>
          <details>
            <summary>Материал и уход</summary>
            <p class="muted"><strong>Материал:</strong> ${materialsByCategory[product.category] || "ткань"}</p>
            <p class="muted"><strong>Уход:</strong> ${careByCategory[product.category] || "см. ярлык"}</p>
          </details>
          <details>
            <summary>Таблица размеров</summary>
            ${renderSizeTable(product.category)}
          </details>
        </div>
      </div>
    </div>
  `;

  let selectedSize = defaultSize;
  let selectedColor = defaultColor;

  const sizeGrid = document.getElementById("sizeGrid");
  const colorChips = document.getElementById("colorChips");
  const selectedSizeHint = document.getElementById("selectedSizeHint");
  const selectedColorHint = document.getElementById("selectedColorHint");

  sizeGrid?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-size]");
    if (!btn) return;
    selectedSize = btn.dataset.size;
    sizeGrid.querySelectorAll(".size-btn").forEach((el) => el.classList.toggle("active", el === btn));
    selectedSizeHint.innerHTML = `Выбран размер: <strong>${selectedSize}</strong>`;
  });

  colorChips?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-color]");
    if (!btn) return;
    selectedColor = btn.dataset.color;
    colorChips.querySelectorAll(".chip-btn").forEach((el) => el.classList.toggle("active", el === btn));
    selectedColorHint.innerHTML = `Выбран цвет: <strong>${selectedColor}</strong>`;
  });

  const addFromDetails = document.getElementById("addFromDetails");
  addFromDetails.addEventListener("click", () => addToCart(product.id, { size: selectedSize, color: selectedColor }));
}

function addToCart(id, variant = {}) {
  const size = variant.size || null;
  const color = variant.color || null;
  const item = state.cart.find((p) => p.id === id && (p.size || null) === size && (p.color || null) === color);
  if (item) item.qty += 1;
  else state.cart.push({ id, qty: 1, size, color });
  saveState();
  updateCartCount();
}

function removeFromCart(id, variant = {}) {
  const size = variant.size || null;
  const color = variant.color || null;
  state.cart = state.cart.filter((item) => !(item.id === id && (item.size || null) === size && (item.color || null) === color));
  saveState();
  renderCart();
}

function renderCart() {
  if (!state.cart.length) {
    cartItems.innerHTML = "<p>Корзина пуста.</p>";
    cartTotal.textContent = formatPrice(0);
    updateCartCount();
    return;
  }

  const rows = state.cart.map((item) => {
    const product = products.find((p) => p.id === item.id);
    const variantLine = [item.size ? `Размер: ${item.size}` : null, item.color ? `Цвет: ${item.color}` : null].filter(Boolean).join(" · ");
    return `
      <div class="cart-row">
        <div class="cart-title">
          <img class="cart-thumb" src="${product.image}" alt="${product.name}" />
          <span>
            <strong>${product.name}</strong> × ${item.qty}
            ${variantLine ? `<div class="muted">${variantLine}</div>` : ""}
          </span>
        </div>
        <div>${formatPrice(product.price * item.qty)}</div>
        <button class="link-btn" data-remove="${item.id}" data-size="${item.size || ""}" data-color="${item.color || ""}">Удалить</button>
      </div>
    `;
  });
  cartItems.innerHTML = rows.join("");
  const total = state.cart.reduce((sum, item) => {
    const p = products.find((product) => product.id === item.id);
    return sum + p.price * item.qty;
  }, 0);
  cartTotal.textContent = formatPrice(total);
  updateCartCount();
}

function updateCartCount() {
  const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = String(totalQty);
}

function formatPrice(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function renderSizeTable(category) {
  if (category === "shoes") {
    return `
      <table class="size-table">
        <thead>
          <tr><th>EU</th><th>Стелька (см)</th><th>Рекомендация</th></tr>
        </thead>
        <tbody>
          <tr><td>36</td><td>23.0</td><td>узкая стопа</td></tr>
          <tr><td>37</td><td>23.8</td><td>стандарт</td></tr>
          <tr><td>38</td><td>24.6</td><td>стандарт</td></tr>
          <tr><td>39</td><td>25.4</td><td>стандарт</td></tr>
          <tr><td>40</td><td>26.2</td><td>на носок</td></tr>
          <tr><td>41</td><td>27.0</td><td>на носок</td></tr>
        </tbody>
      </table>
    `;
  }

  if (category === "bottoms") {
    return `
      <table class="size-table">
        <thead>
          <tr><th>Размер</th><th>Талия (см)</th><th>Бедра (см)</th></tr>
        </thead>
        <tbody>
          <tr><td>XS</td><td>62–66</td><td>86–90</td></tr>
          <tr><td>S</td><td>67–71</td><td>91–95</td></tr>
          <tr><td>M</td><td>72–76</td><td>96–100</td></tr>
          <tr><td>L</td><td>77–81</td><td>101–105</td></tr>
          <tr><td>XL</td><td>82–86</td><td>106–110</td></tr>
        </tbody>
      </table>
    `;
  }

  // tops + outerwear
  return `
    <table class="size-table">
      <thead>
        <tr><th>Размер</th><th>Грудь (см)</th><th>Талия (см)</th></tr>
      </thead>
      <tbody>
        <tr><td>XS</td><td>80–84</td><td>60–64</td></tr>
        <tr><td>S</td><td>85–89</td><td>65–69</td></tr>
        <tr><td>M</td><td>90–94</td><td>70–74</td></tr>
        <tr><td>L</td><td>95–99</td><td>75–79</td></tr>
        <tr><td>XL</td><td>100–104</td><td>80–84</td></tr>
      </tbody>
    </table>
  `;
}

function renderCheckout() {
  if (!checkoutItems || !checkoutTotal || !checkoutForm) return;

  if (!state.cart.length) {
    checkoutItems.innerHTML = "<p>Корзина пуста. Добавьте товары и вернитесь сюда.</p>";
    checkoutTotal.textContent = formatPrice(0);
    checkoutMessage.textContent = "";
    return;
  }

  const rows = state.cart.map((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return "";
    return `
      <div class="checkout-item">
        <img src="${product.image}" alt="${product.name}" />
        <div>
          <div><strong>${product.name}</strong> × ${item.qty}</div>
          <div class="muted">${formatPrice(product.price * item.qty)}</div>
        </div>
      </div>
    `;
  });
  checkoutItems.innerHTML = rows.filter(Boolean).join("");

  const total = state.cart.reduce((sum, item) => {
    const p = products.find((product) => product.id === item.id);
    return sum + p.price * item.qty;
  }, 0);
  checkoutTotal.textContent = formatPrice(total);

  // Prefill address form if user logged in
  if (state.user) {
    const shipName = checkoutForm.querySelector('input[name="shipName"]');
    const shipEmail = checkoutForm.querySelector('input[name="shipEmail"]');
    if (shipName && !shipName.value) shipName.value = state.user.name;
    // shipEmail does not exist in the form, kept for future extension.
    if (shipEmail) shipEmail.value = state.user.email;
  }

  checkoutMessage.textContent = "";
  setupPaymentUI();
  updatePaymentUI();
}

function paymentMethodLabel(method) {
  return {
    card: "Карта",
    sbp: "СБП",
    cod: "При получении"
  }[method] || "—";
}

function setupPaymentUI() {
  if (!checkoutForm) return;
  if (checkoutForm.dataset.paymentUiReady === "1") return;
  checkoutForm.dataset.paymentUiReady = "1";

  const radios = checkoutForm.querySelectorAll('input[name="payMethod"]');
  radios.forEach((r) => r.addEventListener("change", updatePaymentUI));
}

function updatePaymentUI() {
  const selected = checkoutForm ? checkoutForm.querySelector('input[name="payMethod"]:checked') : null;
  const method = selected ? selected.value : "card";

  const cardFields = document.getElementById("cardFields");
  if (!cardFields) return;

  const cardInputs = cardFields.querySelectorAll('input');
  const shouldShowCard = method === "card";
  cardFields.style.display = shouldShowCard ? "block" : "none";
  cardInputs.forEach((input) => {
    input.required = shouldShowCard;
  });
}

function createOrder({ paymentMethod, address }) {
  const items = state.cart.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return {
      id: item.id,
      name: product ? product.name : "Товар",
      price: product ? product.price : 0,
      qty: item.qty
    };
  });

  const total = state.cart.reduce((sum, item) => {
    const p = products.find((product) => product.id === item.id);
    return sum + p.price * item.qty;
  }, 0);

  const order = {
    id: `MU-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    createdAt: new Date().toISOString(),
    user: state.user ? { name: state.user.name, email: state.user.email } : null,
    paymentMethod,
    address,
    items,
    total
  };
  return order;
}

function renderOrderSuccess() {
  if (!orderNumberEl || !orderMetaEl) return;
  const lastOrder = JSON.parse(localStorage.getItem("shop.lastOrder") || "null");
  if (!lastOrder) {
    orderNumberEl.textContent = "—";
    orderMetaEl.innerHTML = "<p>Не удалось загрузить данные заказа.</p>";
    return;
  }
  orderNumberEl.textContent = lastOrder.id;
  orderMetaEl.innerHTML = `
    <p><strong>Оплата:</strong> ${paymentMethodLabel(lastOrder.paymentMethod)}</p>
    <p><strong>Куда:</strong> ${lastOrder.address.shipCity}, ${lastOrder.address.shipAddress}</p>
    <p><strong>Сумма:</strong> ${formatPrice(lastOrder.total)}</p>
    <p class="meta" style="margin-top:10px;"><strong>Состав:</strong> ${lastOrder.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}</p>
  `;
}

function renderProfile() {
    const profileCard = document.getElementById("profileCard");
    if (!profileCard) return;
    
    // Получаем пользователя из localStorage
    let user = JSON.parse(localStorage.getItem("shop.user") || "null");
    
    // Также проверяем глобальное состояние
    if (!user && typeof state !== 'undefined' && state && state.user) {
        user = state.user;
    }
    
    if (!user) {
        profileCard.innerHTML = `
            <p>Вы не авторизованы.</p>
            <button class="btn" onclick="location.hash='#login'">Войти</button>
            <button class="btn" onclick="location.hash='#register'">Зарегистрироваться</button>
        `;
        return;
    }
    
    profileCard.innerHTML = `
        <div style="padding: 20px;">
            <p><strong>👤 Имя:</strong> ${user.name || user.email?.split('@')[0] || "Пользователь"}</p>
            <p><strong>📧 Email:</strong> ${user.email}</p>
            <p><strong>📅 Дата регистрации:</strong> ${new Date().toLocaleDateString()}</p>
            <hr style="margin: 20px 0; border-color: #eee;">
            <button class="btn" id="logoutBtn" style="background: #dc3545;">🚪 Выйти из аккаунта</button>
        </div>
    `;
    
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            // Удаляем пользователя из localStorage
            localStorage.removeItem("shop.user");
            
            // Обновляем глобальное состояние
            if (typeof state !== 'undefined' && state) {
                state.user = null;
            }
            
            // Показываем сообщение
            const profileCard = document.getElementById("profileCard");
            if (profileCard) {
                profileCard.innerHTML = `
                    <p>✅ Вы вышли из аккаунта.</p>
                    <button class="btn" onclick="location.hash='#login'">Войти снова</button>
                `;
            }
            
            // Перенаправляем на главную через 1.5 секунды
            setTimeout(() => {
                location.hash = "#home";
            }, 1500);
        });
    }
}

document.querySelector(".filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  document.querySelectorAll(".filter-btn").forEach((el) => el.classList.toggle("active", el === btn));
  renderCatalog();
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchTerm = e.target.value.trim();
  renderCatalog();
});

productsGrid.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-open]");
  const addBtn = e.target.closest("[data-add]");

  if (openBtn) {
    selectedProductId = Number(openBtn.dataset.open);
    location.hash = "#product";
  }
  if (addBtn) {
    const id = Number(addBtn.dataset.add);
    const p = products.find((x) => x.id === id);
    const size = p?.sizes ? p.sizes[0] : null;
    const color = p?.colors ? p.colors[0] : null;
    addToCart(id, { size, color });
  }
});

document.getElementById("backToCatalog").addEventListener("click", () => {
  location.hash = "#catalog";
});

cartItems.addEventListener("click", (e) => {
  const removeBtn = e.target.closest("[data-remove]");
  if (removeBtn) {
    removeFromCart(Number(removeBtn.dataset.remove), {
      size: removeBtn.dataset.size || null,
      color: removeBtn.dataset.color || null
    });
  }
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!state.cart.length) return;
  location.hash = "#checkout";
});

if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!state.cart.length) {
      checkoutMessage.textContent = "Корзина пуста. Добавьте товары и попробуйте снова.";
      return;
    }

    checkoutMessage.textContent = "";
    const formData = new FormData(checkoutForm);
    const payMethod = String(formData.get("payMethod") || "card");

    const shipName = String(formData.get("shipName") || "").trim();
    const shipPhone = String(formData.get("shipPhone") || "").trim();
    const shipCity = String(formData.get("shipCity") || "").trim();
    const shipAddress = String(formData.get("shipAddress") || "").trim();

    if (!shipName || !shipPhone || !shipCity || !shipAddress) {
      checkoutMessage.textContent = "Заполните поля доставки.";
      return;
    }

    if (payMethod === "card") {
      const cardNumber = String(formData.get("cardNumber") || "").replace(/\D/g, "");
      const cardName = String(formData.get("cardName") || "").trim();
      const cardExpiry = String(formData.get("cardExpiry") || "").trim();
      const cardCvc = String(formData.get("cardCvc") || "").replace(/\D/g, "");

      const expiryOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry);
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        checkoutMessage.textContent = "Проверьте номер карты.";
        return;
      }
      if (!cardName) {
        checkoutMessage.textContent = "Введите имя на карте.";
        return;
      }
      if (!expiryOk) {
        checkoutMessage.textContent = "Введите срок в формате MM/YY.";
        return;
      }
      if (cardCvc.length < 3 || cardCvc.length > 4) {
        checkoutMessage.textContent = "Проверьте CVC.";
        return;
      }
    }

    // sbp и cod: дополнительная валидация на фронтенде не требуется
    const order = createOrder({
      paymentMethod: payMethod,
      address: {
        shipName,
        shipPhone,
        shipCity,
        shipAddress
      }
    });

    const orders = JSON.parse(localStorage.getItem("shop.orders") || "[]");
    orders.unshift(order);
    localStorage.setItem("shop.orders", JSON.stringify(orders));
    localStorage.setItem("shop.lastOrder", JSON.stringify(order));

    state.cart = [];
    saveState();
    updateCartCount();
    location.hash = "#orderSuccess";
  });
}

document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    
    const messageEl = document.getElementById("registerMessage");
    messageEl.textContent = "⏳ Создаём аккаунт...";
    messageEl.style.color = "blue";
    
    try {
        // Шаг 1: Регистрация
        const registerResponse = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        if (!registerResponse.ok) {
            const error = await registerResponse.json();
            throw new Error(error.detail || "Ошибка регистрации");
        }
        
        messageEl.textContent = "✅ Аккаунт создан! Выполняется вход...";
        
        // Шаг 2: Автоматический вход
        const loginResponse = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (loginResponse.ok) {
            const data = await loginResponse.json();
            
            // Сохраняем пользователя
            const user = data.user || { name, email };
            localStorage.setItem("shop.user", JSON.stringify(user));
            
            if (typeof state !== 'undefined' && state) {
                state.user = user;
            }
            
            messageEl.textContent = "✅ Вход выполнен! Перенаправляем в профиль...";
            messageEl.style.color = "green";
            
            // Очищаем форму
            e.target.reset();
            
            // Перенаправляем в профиль
            setTimeout(() => {
                location.hash = "#profile";
                messageEl.textContent = "";
                if (typeof renderProfile !== 'undefined') {
                    renderProfile();
                }
            }, 1000);
        } else {
            // Регистрация прошла, но вход не удался
            messageEl.textContent = "✅ Аккаунт создан! Теперь войдите manually.";
            messageEl.style.color = "green";
            
            setTimeout(() => {
                location.hash = "#login";
            }, 1500);
        }
    } catch (error) {
        messageEl.textContent = `❌ ${error.message}`;
        messageEl.style.color = "red";
    }
});

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    
    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const messageEl = document.getElementById("loginMessage");
        
        if (response.ok) {
            const data = await response.json();
            
            // Сохраняем пользователя в localStorage
            const user = data.user || { email, name: email.split('@')[0] };
            localStorage.setItem("shop.user", JSON.stringify(user));
            
            messageEl.textContent = "✅ Успешный вход! Перенаправляем в профиль...";
            messageEl.style.color = "green";
            
            // Очищаем форму
            e.target.reset();
            
            // Обновляем состояние глобальной переменной, если она есть
            if (typeof state !== 'undefined' && state) {
                state.user = user;
            }
            
            // Через 1 секунду перенаправляем в профиль
            setTimeout(() => {
                location.hash = "#profile";
                messageEl.textContent = "";
                
                // Перезагружаем страницу, чтобы обновить состояние
                if (typeof renderProfile !== 'undefined') {
                    renderProfile();
                }
            }, 1000);
        } else {
            const error = await response.json();
            messageEl.textContent = `❌ ${error.detail || "Неверный email или пароль"}`;
            messageEl.style.color = "red";
        }
    } catch (error) {
        const messageEl = document.getElementById("loginMessage");
        messageEl.textContent = "❌ Ошибка соединения с сервером";
        messageEl.style.color = "red";
    }
});

window.addEventListener("hashchange", route);
updateCartCount();
renderCatalog();
route();
