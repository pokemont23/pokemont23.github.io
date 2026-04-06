// ========== ПРОСТОЙ ТЕСТОВЫЙ КОД ==========
const API_URL = 'https://script.google.com/macros/s/AKfycbxwnUg3bbzT2LpWjmLu6Qgw1eh8a3yKU8AHrtrC83MYWsxw8FjD60No0F_1pWFQ56OD/exec';

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
