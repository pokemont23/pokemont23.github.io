// ========== НАСТРОЙКИ ==========
// ССЫЛКА НА ВАШУ ТАБЛИЦУ В ФОРМАТЕ CSV
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTww-OnfU1ca9Ef78Dfd8WpGxP8bheCVLO9rRW-F0UgCktayrfl6suklDsygTcl1uU79o2q--brHV7G/pub?gid=0&single=true&output=csv';

const USD_TO_BYN = 3.2;

function formatPrice(usd) {
    const byn = Math.round(usd * USD_TO_BYN);
    return `${usd.toLocaleString()} $ / ${byn.toLocaleString()} Br`;
}

// ========== ЗАГРУЗКА ДАННЫХ ==========
let carsData = [];

async function loadCars() {
    console.log('🔄 Загружаю данные из таблицы...');
    try {
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        
        // Разбираем CSV
        const rows = csvText.trim().split('\n');
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        
        carsData = [];
        for (let i = 1; i < rows.length; i++) {
            const values = rows[i].split(',');
            const car = {};
            headers.forEach((header, idx) => {
                let val = values[idx] ? values[idx].trim().replace(/^"|"$/g, '') : '';
                car[header] = val;
            });
            car.id = i;
            car.ценаusd = parseFloat(car.ценаusd) || 0;
            carsData.push(car);
        }
        
        console.log(`✅ Загружено ${carsData.length} автомобилей`);
        renderNewCars();
        if (document.getElementById('catalogPage').classList.contains('active-page')) {
            renderCars(carsData);
            initFilters();
        }
    } catch (error) {
        console.error('❌ Ошибка:', error);
        document.getElementById('carsGrid').innerHTML = '<div style="padding:2rem;text-align:center;">⚠️ Ошибка загрузки. Проверьте доступ к таблице.</div>';
    }
}

// ========== ОТОБРАЖЕНИЕ ==========
function renderCars(cars, containerId = 'carsGrid') {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    if (!cars.length) { grid.innerHTML = '<div style="padding:2rem;">🚗 Нет данных</div>'; return; }
    
    grid.innerHTML = '';
    cars.forEach(car => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
            <div class="car-img-placeholder" style="font-size:3rem;">🚗</div>
            <h3>${car.марка || ''} ${car.модель || ''}</h3>
            <div class="car-specs">${car.год || ''} • ${car.пробег || ''} км • ${car.двигатель || ''}</div>
            <div class="car-price">${formatPrice(car.ценаusd)}</div>
            <div class="car-short">${car.краткое_описание || ''}</div>
            <button class="btn-card" onclick="showModal(${car.id})">Подробнее</button>
        `;
        grid.appendChild(card);
    });
}

function renderNewCars() { renderCars(carsData.slice(0, 3), 'newCarsGrid'); }
function showModal(id) {
    const car = carsData.find(c => c.id == id);
    if (!car) return;
    document.getElementById('modalDetails').innerHTML = `
        <h2>${car.марка} ${car.модель}</h2>
        <div class="modal-specs"><p>Год: ${car.год}</p><p>Пробег: ${car.пробег} км</p><p>Двигатель: ${car.двигатель}</p><p>Коробка: ${car.коробка}</p><p>Цена: ${formatPrice(car.ценаusd)}</p></div>
        <div class="modal-desc"><h3>Описание</h3><p>${car.полное_описание || ''}</p></div>
        <button class="btn btn-primary" onclick="document.getElementById('carModal').style.display='none'">Закрыть</button>`;
    document.getElementById('carModal').style.display = 'flex';
}

// ========== ФИЛЬТРАЦИЯ ==========
function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const brandFilter = document.getElementById('brandFilter');
    if (!searchInput || !brandFilter) return;
    const brands = ['all', ...new Set(carsData.map(c => c.марка))];
    brandFilter.innerHTML = brands.map(b => `<option value="${b}">${b === 'all' ? 'Все марки' : b}</option>`).join('');
    const filter = () => {
        const term = searchInput.value.toLowerCase();
        const brand = brandFilter.value;
        const filtered = carsData.filter(c => (c.марка || '').toLowerCase().includes(term) || (c.модель || '').toLowerCase().includes(term)) && carsData.filter(c => brand === 'all' || c.марка === brand);
        renderCars(filtered);
    };
    searchInput.addEventListener('input', filter);
    brandFilter.addEventListener('change', filter);
    filter();
}

function showPage(name) {
    document.getElementById('homePage').classList.toggle('active-page', name === 'home');
    document.getElementById('catalogPage').classList.toggle('active-page', name === 'catalog');
    if (name === 'catalog') { renderCars(carsData); initFilters(); }
    else renderNewCars();
    if (window.innerWidth <= 768) document.getElementById('navLinks')?.classList.remove('active');
}

function openAboutModal() { document.getElementById('aboutModal').style.display = 'flex'; }
function closeAboutModal() { document.getElementById('aboutModal').style.display = 'none'; }
function openContactsModal() { document.getElementById('contactsModal').style.display = 'flex'; }
function closeContactsModal() { document.getElementById('contactsModal').style.display = 'none'; }

document.getElementById('testDriveForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('formMessage');
    const name = document.getElementById('name')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    if (!name || !phone) msg.innerText = '❌ Заполните имя и телефон';
    else { msg.innerText = `✅ Спасибо, ${name}! Мы свяжемся.`; e.target.reset(); }
    setTimeout(() => msg.innerText = '', 4000);
});

document.querySelectorAll('.close-modal, .close-about-modal, .close-contacts-modal').forEach(btn => btn.onclick = () => {
    document.getElementById('carModal').style.display = 'none';
    document.getElementById('aboutModal').style.display = 'none';
    document.getElementById('contactsModal').style.display = 'none';
});
window.onclick = (e) => {
    if (e.target === document.getElementById('carModal')) document.getElementById('carModal').style.display = 'none';
    if (e.target === document.getElementById('aboutModal')) document.getElementById('aboutModal').style.display = 'none';
    if (e.target === document.getElementById('contactsModal')) document.getElementById('contactsModal').style.display = 'none';
};

document.getElementById('menuToggle')?.addEventListener('click', () => document.getElementById('navLinks')?.classList.toggle('active'));

loadCars();
