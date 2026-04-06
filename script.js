// script.js — вся логика сайта

// ========== НАСТРОЙКИ ==========
const USD_TO_BYN = 3.2;

function formatPrice(usd) {
    const byn = Math.round(usd * USD_TO_BYN);
    return `${usd.toLocaleString()} $ / ${byn.toLocaleString()} Br`;
}

// ========== БАЗА ДАННЫХ АВТОМОБИЛЕЙ ==========
const carsData = [
    {
        id: 1,
        brand: "BMW",
        model: "X5 40i",
        year: 2021,
        mileage: 68000,
        engine: "3.0 л (340 л.с.)",
        transmission: "Автомат",
        color: "Чёрный",
        priceUSD: 15500,
        shortDesc: "Премиум внедорожник, полный привод, кожа",
        fullDesc: "BMW X5 в идеальном состоянии. Полный сервис у официального дилера. 2 владельца. Пакет M Sport, адаптивная подвеска, проекционный дисплей, аудиосистема Harman Kardon.",
        images: ["🚗", "🏎️", "🚙"],
        isNew: true
    },
    {
        id: 2,
        brand: "Mercedes-Benz",
        model: "GLE 350d",
        year: 2022,
        mileage: 42000,
        engine: "3.0 л (367 л.с.)",
        transmission: "Автомат",
        color: "Серебристый",
        priceUSD: 18400,
        shortDesc: "Дизель, полный привод, AMG пакет",
        fullDesc: "Mercedes GLE в максимальной комплектации. Подогрев всех сидений, вентиляция, массаж, 360 камер, ночное видение.",
        images: ["🚙", "🏎️", "🚗"],
        isNew: true
    },
    {
        id: 3,
        brand: "Kia",
        model: "Sportage",
        year: 2023,
        mileage: 25000,
        engine: "2.0 л (150 л.с.)",
        transmission: "Автомат",
        color: "Белый",
        priceUSD: 7800,
        shortDesc: "Городской кроссовер, экономичный",
        fullDesc: "Kia Sportage 4 поколения. Мультимедиа с большим экраном, подогрев руля и лобового стекла, бесключевой доступ.",
        images: ["🚘", "🚗", "🚙"],
        isNew: true
    },
    {
        id: 4,
        brand: "Hyundai",
        model: "Solaris",
        year: 2022,
        mileage: 33000,
        engine: "1.6 л (123 л.с.)",
        transmission: "Автомат",
        color: "Синий",
        priceUSD: 5300,
        shortDesc: "Надёжный седан для города",
        fullDesc: "Hyundai Solaris в отличном состоянии. Кондиционер, электростеклоподъёмники, подогрев передних сидений.",
        images: ["🚗", "🚘"],
        isNew: false
    },
    {
        id: 5,
        brand: "Audi",
        model: "Q7",
        year: 2020,
        mileage: 89000,
        engine: "3.0 л (333 л.с.)",
        transmission: "Автомат",
        color: "Тёмно-синий",
        priceUSD: 13400,
        shortDesc: "Семейный 7-местный внедорожник",
        fullDesc: "Audi Q7 с 3 рядами сидений. Кожаный салон, адаптивный круиз-контроль, система ночного видения, 4 зоны климат-контроля.",
        images: ["🏎️", "🚙", "🚗"],
        isNew: false
    },
    {
        id: 6,
        brand: "Toyota",
        model: "Land Cruiser Prado",
        year: 2021,
        mileage: 55000,
        engine: "2.8 л (204 л.с.)",
        transmission: "Автомат",
        color: "Бежевый",
        priceUSD: 14900,
        shortDesc: "Надёжный рамный внедорожник",
        fullDesc: "Toyota Prado в комплектации Black Edition. Лебёдка, блокировки, холодильник, третий ряд сидений.",
        images: ["🚙", "🏎️"],
        isNew: false
    }
];

// ========== ФУНКЦИИ ДЛЯ МОДАЛЬНЫХ ОКОН ==========
function openAboutModal() {
    document.getElementById('aboutModal').style.display = 'flex';
}

function closeAboutModal() {
    document.getElementById('aboutModal').style.display = 'none';
}

function openContactsModal() {
    document.getElementById('contactsModal').style.display = 'flex';
}

function closeContactsModal() {
    document.getElementById('contactsModal').style.display = 'none';
}

// ========== ПОКАЗ МОДАЛКИ С ГАЛЕРЕЕЙ ==========
let currentGalleryIndex = 0;
let currentGalleryImages = [];

function showModal(carId) {
    const car = carsData.find(c => c.id === carId);
    if (!car) return;
    
    currentGalleryImages = car.images || ["🚗", "🏎️", "🚙"];
    currentGalleryIndex = 0;
    
    const modal = document.getElementById('carModal');
    const modalDetails = document.getElementById('modalDetails');
    
    modalDetails.innerHTML = `
        <h2>${car.brand} ${car.model}</h2>
        <div class="car-gallery">
            <div class="gallery-container">
                <button class="gallery-prev" onclick="changeImage(-1)">◀</button>
                <img id="galleryImage" class="gallery-img" src="${currentGalleryImages[0]}" alt="${car.brand} ${car.model}">
                <button class="gallery-next" onclick="changeImage(1)">▶</button>
            </div>
            <div class="gallery-counter" id="galleryCounter">1 / ${currentGalleryImages.length}</div>
        </div>
        <div class="modal-specs">
            <p><strong>Год:</strong> ${car.year}</p>
            <p><strong>Пробег:</strong> ${car.mileage.toLocaleString()} км</p>
            <p><strong>Двигатель:</strong> ${car.engine}</p>
            <p><strong>Коробка:</strong> ${car.transmission}</p>
            <p><strong>Цвет:</strong> ${car.color}</p>
            <p><strong>Цена:</strong> ${formatPrice(car.priceUSD)}</p>
        </div>
        <div class="modal-desc">
            <h3>Полное описание:</h3>
            <p>${car.fullDesc}</p>
        </div>
        <button class="btn btn-primary" onclick="document.getElementById('carModal').style.display='none'" style="margin-top:20px;">Закрыть</button>
    `;
    
    modal.style.display = 'flex';
}

function changeImage(direction) {
    currentGalleryIndex += direction;
    if (currentGalleryIndex < 0) currentGalleryIndex = currentGalleryImages.length - 1;
    if (currentGalleryIndex >= currentGalleryImages.length) currentGalleryIndex = 0;
    
    const imgElement = document.getElementById('galleryImage');
    const counterElement = document.getElementById('galleryCounter');
    
    if (imgElement) {
        imgElement.src = currentGalleryImages[currentGalleryIndex];
    }
    if (counterElement) {
        counterElement.textContent = `${currentGalleryIndex + 1} / ${currentGalleryImages.length}`;
    }
}

// ========== ОТОБРАЖЕНИЕ КАРТОЧЕК ==========
function renderCars(cars, containerId = 'carsGrid') {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    
    grid.innerHTML = '';
    
    cars.forEach(car => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
            <div class="car-img-placeholder">${car.images && car.images[0] ? car.images[0] : '🚗'}</div>
            <h3>${car.brand} ${car.model}</h3>
            <div class="car-specs">${car.year} • ${car.mileage.toLocaleString()} км • ${car.engine}</div>
            <div class="car-price">${formatPrice(car.priceUSD)}</div>
            <div class="car-short">${car.shortDesc}</div>
            <button class="btn-card" onclick="showModal(${car.id})">Подробнее</button>
        `;
        grid.appendChild(card);
    });
}

// ========== ПОКАЗ САМЫХ НОВЫХ АВТО ==========
function renderNewCars() {
    const newCars = carsData.filter(car => car.isNew === true).slice(0, 3);
    renderCars(newCars, 'newCarsGrid');
}

// ========== ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ ==========
function showPage(pageName) {
    const homePage = document.getElementById('homePage');
    const catalogPage = document.getElementById('catalogPage');
    
    if (homePage) homePage.classList.remove('active-page');
    if (catalogPage) catalogPage.classList.remove('active-page');
    
    if (pageName === 'home') {
        if (homePage) homePage.classList.add('active-page');
        renderNewCars();
    } else if (pageName === 'catalog') {
        if (catalogPage) catalogPage.classList.add('active-page');
        renderCars(carsData);
        initFilters();
    }
    
    const navLinks = document.getElementById('navLinks');
    if (window.innerWidth <= 768 && navLinks) {
        navLinks.classList.remove('active');
    }
}

// ========== ФИЛЬТРАЦИЯ ==========
function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const brandFilter = document.getElementById('brandFilter');
    
    if (!searchInput || !brandFilter) return;
    
    const brands = ['all', ...new Set(carsData.map(c => c.brand))];
    brandFilter.innerHTML = brands.map(b => `<option value="${b}">${b === 'all' ? 'Все марки' : b}</option>`).join('');
    
    function filterCars() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedBrand = brandFilter.value;
        
        const filtered = carsData.filter(car => {
            const matchSearch = car.brand.toLowerCase().includes(searchTerm) || car.model.toLowerCase().includes(searchTerm);
            const matchBrand = selectedBrand === 'all' || car.brand === selectedBrand;
            return matchSearch && matchBrand;
        });
        
        renderCars(filtered);
    }
    
    searchInput.addEventListener('input', filterCars);
    brandFilter.addEventListener('change', filterCars);
    filterCars();
}

// ========== ФОРМА ТЕСТ-ДРАЙВА ==========
const testForm = document.getElementById('testDriveForm');
const formMessage = document.getElementById('formMessage');

if (testForm) {
    testForm.onsubmit = (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const carModel = document.getElementById('carModel').value.trim();
        
        if (!name || !phone) {
            if (formMessage) {
                formMessage.textContent = '❌ Пожалуйста, заполните имя и телефон';
                formMessage.style.color = '#e86f2c';
            }
        } else {
            let message = `✅ Спасибо, ${name}! Мы свяжемся с вами по номеру ${phone}`;
            if (carModel) {
                message += ` по поводу авто ${carModel}`;
            }
            message += '. Ожидайте звонка в ближайшее время.';
            
            if (formMessage) {
                formMessage.textContent = message;
                formMessage.style.color = '#7bcfa6';
            }
            
            testForm.reset();
        }
        
        setTimeout(() => {
            if (formMessage) formMessage.textContent = '';
        }, 5000);
    };
}

// ========== МОБИЛЬНОЕ МЕНЮ ==========
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
    menuToggle.onclick = () => {
        if (navLinks) navLinks.classList.toggle('active');
    };
}

// ========== ЗАКРЫТИЕ МОДАЛОК ==========
document.querySelectorAll('.close-modal, .close-about-modal, .close-contacts-modal').forEach(btn => {
    if (btn) {
        btn.onclick = () => {
            document.getElementById('carModal').style.display = 'none';
            document.getElementById('aboutModal').style.display = 'none';
            document.getElementById('contactsModal').style.display = 'none';
        };
    }
});

window.onclick = (e) => {
    const carModal = document.getElementById('carModal');
    const aboutModal = document.getElementById('aboutModal');
    const contactsModal = document.getElementById('contactsModal');
    
    if (e.target === carModal) carModal.style.display = 'none';
    if (e.target === aboutModal) aboutModal.style.display = 'none';
    if (e.target === contactsModal) contactsModal.style.display = 'none';
};

// ========== ЗАПУСК ==========
renderNewCars();
