// ========== НАСТРОЙКИ ==========
const API_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTww-OnfU1ca9Ef78Dfd8WpGxP8bheCVLO9rRW-F0UgCktayrfl6suklDsygTcl1uU79o2q--brHV7G/pubhtml';
const USD_TO_BYN = 3.2; // Курс доллара

function formatPrice(usd) {
    const byn = Math.round(usd * USD_TO_BYN);
    return `${usd.toLocaleString()} $ / ${byn.toLocaleString()} Br`;
}

// ========== ЗАГРУЗКА ДАННЫХ ИЗ ТАБЛИЦЫ ==========
let carsData = [];

async function loadCarsFromSheet() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        carsData = data;
        console.log('✅ Данные загружены, машин:', carsData.length);
        
        renderNewCars();
        if (document.getElementById('catalogPage').classList.contains('active-page')) {
            renderCars(carsData);
            initFilters();
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
        document.getElementById('carsGrid').innerHTML = '<div style="text-align:center; padding:2rem;">⚠️ Ошибка загрузки данных из таблицы</div>';
    }
}

// ========== ПОЛУЧИТЬ ПУТЬ К ФОТО ==========
function getCarImage(car) {
    if (car.фото && car.фото.trim() !== '') {
        return `images/${car.фото}`;
    }
    // Если фото нет — показываем эмодзи
    return '🚗';
}

// ========== ОТОБРАЖЕНИЕ КАРТОЧЕК ==========
function renderCars(cars, containerId = 'carsGrid') {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    
    if (!cars || cars.length === 0) {
        grid.innerHTML = '<div style="text-align:center; padding:2rem;">🚗 Автомобили загружаются...</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    cars.forEach(car => {
        const imageHtml = getCarImage(car);
        const isEmoji = imageHtml.length <= 2;
        
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
            <div class="car-img-placeholder">
                ${isEmoji ? `<div style="font-size: 3rem;">${imageHtml}</div>` : `<img src="${imageHtml}" alt="${car.марка} ${car.модель}" style="width:100%; height:180px; object-fit:cover; border-radius:16px;">`}
            </div>
            <h3>${car.марка || ''} ${car.модель || ''}</h3>
            <div class="car-specs">${car.год || ''} • ${car.пробег ? car.пробег.toLocaleString() : ''} км • ${car.двигатель || ''}</div>
            <div class="car-price">${formatPrice(car.ценаUSD || 0)}</div>
            <div class="car-short">${car.краткое_описание || ''}</div>
            <button class="btn-card" onclick="showModal(${car.id})">Подробнее</button>
        `;
        grid.appendChild(card);
    });
}

function renderNewCars() {
    const newCars = carsData.slice(0, 3);
    renderCars(newCars, 'newCarsGrid');
}

// ========== МОДАЛЬНОЕ ОКНО (с фото) ==========
function showModal(carId) {
    const car = carsData.find(c => c.id == carId);
    if (!car) return;
    
    const imageHtml = getCarImage(car);
    const isEmoji = imageHtml.length <= 2;
    
    const modal = document.getElementById('carModal');
    const modalDetails = document.getElementById('modalDetails');
    
    modalDetails.innerHTML = `
        <h2>${car.марка} ${car.модель}</h2>
        <div style="margin: 1rem 0; text-align:center; background:#0f151c; border-radius:20px; padding:1rem;">
            ${isEmoji ? `<div style="font-size: 5rem;">${imageHtml}</div>` : `<img src="${imageHtml}" alt="${car.марка} ${car.модель}" style="max-width:100%; max-height:250px; border-radius:16px;">`}
        </div>
        <div class="modal-specs">
            <p><strong>Год:</strong> ${car.год}</p>
            <p><strong>Пробег:</strong> ${car.пробег?.toLocaleString()} км</p>
            <p><strong>Двигатель:</strong> ${car.двигатель}</p>
            <p><strong>Коробка:</strong> ${car.коробка}</p>
            <p><strong>Цвет:</strong> ${car.цвет}</p>
            <p><strong>Цена:</strong> ${formatPrice(car.ценаUSD)}</p>
        </div>
        <div class="modal-desc">
            <h3>Полное описание:</h3>
            <p>${car.полное_описание || 'Нет описания'}</p>
        </div>
        <button class="btn btn-primary" onclick="document.getElementById('carModal').style.display='none'" style="margin-top:20px;">Закрыть</button>
    `;
    modal.style.display = 'flex';
}

// ========== ФИЛЬТРАЦИЯ ==========
function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const brandFilter = document.getElementById('brandFilter');
    if (!searchInput || !brandFilter || !carsData.length) return;
    
    const brands = ['all', ...new Set(carsData.map(c => c.марка))];
    brandFilter.innerHTML = brands.map(b => `<option value="${b}">${b === 'all' ? 'Все марки' : b}</option>`).join('');
    
    function filterCars() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedBrand = brandFilter.value;
        const filtered = carsData.filter(car => {
            const matchSearch = (car.марка || '').toLowerCase().includes(searchTerm) || (car.модель || '').toLowerCase().includes(searchTerm);
            const matchBrand = selectedBrand === 'all' || car.марка === selectedBrand;
            return matchSearch && matchBrand;
        });
        renderCars(filtered);
    }
    
    searchInput.addEventListener('input', filterCars);
    brandFilter.addEventListener('change', filterCars);
    filterCars();
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
            if (carModel) message += ` по поводу авто ${carModel}`;
            message += '. Ожидайте звонка.';
            if (formMessage) {
                formMessage.textContent = message;
                formMessage.style.color = '#7bcfa6';
            }
            testForm.reset();
        }
        setTimeout(() => { if (formMessage) formMessage.textContent = ''; }, 5000);
    };
}

// ========== МОБИЛЬНОЕ МЕНЮ ==========
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle) {
    menuToggle.onclick = () => { if (navLinks) navLinks.classList.toggle('active'); };
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
    if (e.target === document.getElementById('carModal')) document.getElementById('carModal').style.display = 'none';
    if (e.target === document.getElementById('aboutModal')) document.getElementById('aboutModal').style.display = 'none';
    if (e.target === document.getElementById('contactsModal')) document.getElementById('contactsModal').style.display = 'none';
};

// ========== ЗАПУСК ==========
loadCarsFromSheet();
