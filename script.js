// ========== ПРОСТОЙ ТЕСТОВЫЙ КОД ==========
const API_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTww-OnfU1ca9Ef78Dfd8WpGxP8bheCVLO9rRW-F0UgCktayrfl6suklDsygTcl1uU79o2q--brHV7G/pubhtml';

async function testLoad() {
    console.log('Начинаю загрузку...');
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log('Данные из таблицы:', data);
        
        // Покажем данные прямо на странице
        const grid = document.getElementById('carsGrid');
        if (grid) {
            grid.innerHTML = `<pre style="color:white; background:#1a212b; padding:1rem; overflow:auto;">${JSON.stringify(data, null, 2)}</pre>`;
        }
    } catch (error) {
        console.error('Ошибка:', error);
        const grid = document.getElementById('carsGrid');
        if (grid) {
            grid.innerHTML = `<div style="color:red; padding:2rem;">Ошибка: ${error.message}</div>`;
        }
    }
}

// Запускаем тест
testLoad();

// Остальные функции (showPage и т.д.) пока не нужны, оставляем заглушки
function showPage() {}
function renderNewCars() {}
function initFilters() {}
function renderCars() {}
