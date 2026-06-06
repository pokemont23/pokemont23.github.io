// ========== НАСТРОЙКИ ==========
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTww-OnfU1ca9Ef78Dfd8WpGxP8bheCVLO9rRW-F0UgCktayrfl6suklDsygTcl1uU79o2q--brHV7G/pub?gid=0&single=true&output=csv';
const USD_TO_BYN = 3.2;

function formatPrice(usd) {
    const byn = Math.round(usd * USD_TO_BYN);
    return `${usd.toLocaleString()} $ / ${byn.toLocaleString()} Br`;
}

// ========== ЗАГРУЗКА ДАННЫХ ==========
let carsData = [];

async function loadCars() {
    console.log('🔄 Загружаю данные...');
    const grid = document.getElementById('carsGrid');
    if (grid) grid.innerHTML = '<div style="padding:2rem;text-align:center;">📥 Загрузка автомобилей...</div>';
    
    try {
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
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
            
            // Разбираем фото (разделитель ; или ,)
            let photos = [];
            if (car.фото && car.фото.trim() !== '') {
                photos = car.фото.split(/[;,]/).map(p => p.trim()).filter(p => p !== '');
            }
            
            carsData.push({
                id: parseInt(car.id) || i,
                марка: car.марка || '',
                модель: car.модель || '',
                год: car.год || '',
                пробег: car.пробег || '',
                двигатель: car.двигатель || '',
                коробка: car.коробка || '',
                цвет: car.цвет || '',
                ценаUSD: parseFloat(car.ценаusd) || 0,
                краткое_описание: car.краткое_описание || '',
                полное_описание: car.полное_описание || '',
                photos: photos.map(p => `images/${p}`)
            });
        }
        
        console.log(`✅ Загружено ${carsData.length} авто`);
        renderNewCars();
        if (document.getElementById('catalogPage').classList.contains('active-page')) {
            renderCars(carsData);
            initFilters();
        }
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
        if (grid) grid.innerHTML = '<div style="padding:2rem;text-align:center;color:#e86f2c;">⚠️ Ошибка загрузки данных</div>';
    }
}

// ========== ОТОБРАЖЕНИЕ КАРТОЧЕК ==========
function renderCars(cars, containerId = 'carsGrid') {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    if (!cars.length) { grid.innerHTML = '<div style="padding:2rem;text-align:center;">🚗 Нет автомобилей</div>'; return; }
    
    grid.innerHTML = '';
    cars.forEach(car => {
        const firstPhoto = car.photos && car.photos.length > 0 ? car.photos[0] : null;
        const imageHtml = firstPhoto 
            ? `<img src="${firstPhoto}" alt="${car.марка} ${car.модель}">`
            : `<div style="font-size:3rem;">🚗</div>`;
        
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
            <div class="car-img-placeholder">${imageHtml}</div>
            <h3>${car.марка || ''} ${car.модель || ''}</h3>
            <div class="car-specs">${car.год || ''} • ${car.пробег || ''} км • ${car.двигатель || ''}</div>
            <div class="car-price">${formatPrice(car.ценаUSD)}</div>
            <div class="car-short">${car.краткое_описание || ''}</div>
            <button class="btn-card" onclick="showModal(${car.id})">Подробнее</button>
        `;
        grid.appendChild(card);
    });
}

function renderNewCars() { renderCars(carsData.slice(0, 3), 'newCarsGrid'); }

// ========== МОДАЛЬНОЕ ОКНО С ГАЛЕРЕЕЙ ==========
let currentCar = null;
let currentPhotoIndex = 0;

function showModal(id) {
    currentCar = carsData.find(c => c.id == id);
    if (!currentCar) return;
    currentPhotoIndex = 0;
    updateModal();
    document.getElementById('carModal').style.display = 'flex';
}

function updateModal() {
    if (!currentCar) return;
    
    const photos = currentCar.photos || [];
    const hasMultiple = photos.length > 1;
    const currentPhoto = photos.length > 0 ? photos[currentPhotoIndex] : null;
    
    const photoHtml = currentPhoto 
        ? `<img src="${currentPhoto}" alt="${currentCar.марка} ${currentCar.модель}" id="modalPhoto">`
        : `<div style="font-size:5rem;">🚗</div>`;
    
    const navButtons = hasMultiple ? `
        <button class="gallery-prev" onclick="changePhoto(-1)">◀</button>
        <button class="gallery-next" onclick="changePhoto(1)">▶</button>
        <div class="gallery-counter">${currentPhotoIndex + 1} / ${photos.length}</div>
    ` : '';
    
    const modalDetails = document.getElementById('modalDetails');
    modalDetails.innerHTML = `
        <h2>${currentCar.марка || ''} ${currentCar.модель || ''}</h2>
        <div class="modal-gallery">
            <div class="gallery-container">
                ${photoHtml}
                ${navButtons}
            </div>
        </div>
        <div class="modal-specs">
            <p><strong>📅 Год:</strong> ${currentCar.год || ''}</p>
            <p><strong>📊 Пробег:</strong> ${currentCar.пробег || ''} км</p>
            <p><strong>🔧 Двигатель:</strong> ${currentCar.двигатель || ''}</p>
            <p><strong>⚙️ Коробка:</strong> ${currentCar.коробка || ''}</p>
            <p><strong>🎨 Цвет:</strong> ${currentCar.цвет || ''}</p>
            <p><strong>💰 Цена:</strong> ${formatPrice(currentCar.ценаUSD)}</p>
        </div>
        <div class="modal-desc">
            <h3>📝 Полное описание</h3>
            <div class="full-description">${(currentCar.полное_описание || 'Нет описания').replace(/\n/g, '<br>')}</div>
        </div>
        <button class="btn btn-primary" onclick="document.getElementById('carModal').style.display='none'">Закрыть</button>
    `;
}

function changePhoto(direction) {
    if (!currentCar) return;
    const photos = currentCar.photos || [];
    if (photos.length <= 1) return;
    
    currentPhotoIndex += direction;
    if (currentPhotoIndex < 0) currentPhotoIndex = photos.length - 1;
    if (currentPhotoIndex >= photos.length) currentPhotoIndex = 0;
    
    const photoElement = document.getElementById('modalPhoto');
    if (photoElement) {
        photoElement.src = photos[currentPhotoIndex];
    }
    
    const counter = document.querySelector('.gallery-counter');
    if (counter) {
        counter.textContent = `${currentPhotoIndex + 1} / ${photos.length}`;
    }
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
        let filtered = carsData.filter(c => 
            (c.марка || '').toLowerCase().includes(term) || (c.модель || '').toLowerCase().includes(term)
        );
        if (brand !== 'all') {
            filtered = filtered.filter(c => c.марка === brand);
        }
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

// ========== EMAILJS ФОРМА ТЕСТ-ДРАЙВА (v4) ==========
const EMAILJS_SERVICE_ID = 'service_fzv2ep3';
const EMAILJS_TEMPLATE_ID = 'template_anpxh2k';
const EMAILJS_PUBLIC_KEY = 'wjf6w7Rb0kONhP3Jv';

// Инициализация EmailJS v4
emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
});

const emailForm = document.getElementById('testDriveForm');
const emailMessage = document.getElementById('formMessage');

if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const car = document.getElementById('car')?.value.trim();
        
        if (!name || !phone) {
            if (emailMessage) {
                emailMessage.textContent = '❌ Пожалуйста, заполните имя и телефон';
                emailMessage.style.color = '#e86f2c';
            }
            return;
        }
        
        if (emailMessage) {
            emailMessage.textContent = '📧 Отправка заявки...';
            emailMessage.style.color = '#f5b042';
        }
        
        const now = new Date();
        const dateStr = now.toLocaleString('ru-RU');
        
        const templateParams = {
            имя: name,
            телефон: phone,
            автомобиль: car || 'Не указан',
            дата: dateStr
        };
        
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function() {
                if (emailMessage) {
                    emailMessage.textContent = '✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.';
                    emailMessage.style.color = '#7bcfa6';
                }
                emailForm.reset();
                setTimeout(() => {
                    if (emailMessage) emailMessage.textContent = '';
                }, 5000);
            })
            .catch(function(error) {
                console.error('Ошибка:', error);
                if (emailMessage) {
                    emailMessage.textContent = '❌ Ошибка отправки. Попробуйте позже или позвоните нам.';
                    emailMessage.style.color = '#e86f2c';
                }
            });
    });
}
