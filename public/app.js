document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('country-select');
    const citySelect = document.getElementById('city-select');
    const weatherCard = document.getElementById('weather-card');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');

    // Weather data elements
    const cityNameEl = document.getElementById('city-name');
    const weatherDescEl = document.getElementById('weather-desc');
    const tempValueEl = document.getElementById('temp-value');
    const feelsLikeEl = document.getElementById('feels-like');
    const humidityEl = document.getElementById('humidity');
    const windEl = document.getElementById('wind');
    const weatherIconEl = document.getElementById('weather-icon');

    // WMO Weather interpretation codes
    const weatherCodes = {
        0: { desc: 'Ясно', icon: '☀️' },
        1: { desc: 'Преимущественно ясно', icon: '🌤️' },
        2: { desc: 'Переменная облачность', icon: '⛅' },
        3: { desc: 'Пасмурно', icon: '☁️' },
        45: { desc: 'Туман', icon: '🌫️' },
        48: { desc: 'Оседающий туман', icon: '🌫️' },
        51: { desc: 'Слабая морось', icon: '🌧️' },
        53: { desc: 'Умеренная морось', icon: '🌧️' },
        55: { desc: 'Сильная морось', icon: '🌧️' },
        61: { desc: 'Слабый дождь', icon: '🌦️' },
        63: { desc: 'Умеренный дождь', icon: '🌧️' },
        65: { desc: 'Сильный дождь', icon: '🌧️' },
        71: { desc: 'Слабый снег', icon: '🌨️' },
        73: { desc: 'Умеренный снег', icon: '❄️' },
        75: { desc: 'Снегопад', icon: '❄️' },
        80: { desc: 'Слабый ливень', icon: '🌦️' },
        81: { desc: 'Умеренный ливень', icon: '🌧️' },
        82: { desc: 'Сильный ливень', icon: '⛈️' },
        95: { desc: 'Гроза', icon: '🌩️' },
        96: { desc: 'Гроза с градом', icon: '⛈️' },
        99: { desc: 'Сильная гроза с градом', icon: '⛈️' }
    };

    let citiesData = [];

    // Load countries on start
    fetchCountries();

    countrySelect.addEventListener('change', (e) => {
        const country = e.target.value;
        fetchCities(country);
        
        // Hide weather card and change state
        weatherCard.classList.add('hidden');
        setTimeout(() => {
            weatherCard.style.position = 'absolute';
        }, 500); // Wait for transition
    });

    citySelect.addEventListener('change', (e) => {
        const cityId = parseInt(e.target.value);
        const cityInfo = citiesData.find(c => c.id === cityId);
        if (cityInfo) {
            fetchWeather(cityInfo);
        }
    });

    async function fetchCountries() {
        try {
            const response = await fetch('/api/countries');
            if (!response.ok) throw new Error('Ошибка сети');
            const countries = await response.json();
            
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });
        } catch (error) {
            showError('Не удалось загрузить список стран.');
        }
    }

    async function fetchCities(country) {
        citySelect.innerHTML = '<option value="" disabled selected>Выберите город</option>';
        citySelect.disabled = true;
        
        try {
            const response = await fetch(`/api/cities/${encodeURIComponent(country)}`);
            if (!response.ok) throw new Error('Ошибка сети');
            citiesData = await response.json();
            
            citiesData.forEach(city => {
                const option = document.createElement('option');
                option.value = city.id;
                option.textContent = city.city;
                citySelect.appendChild(option);
            });
            
            citySelect.disabled = false;
        } catch (error) {
            showError('Не удалось загрузить список городов.');
        }
    }

    async function fetchWeather(cityInfo) {
        showLoader();
        weatherCard.classList.add('hidden');
        weatherCard.style.position = 'absolute';
        errorMessage.classList.add('hidden');

        try {
            const response = await fetch(`/api/weather?lat=${cityInfo.latitude}&lon=${cityInfo.longitude}`);
            if (!response.ok) throw new Error('Ошибка при получении погоды');
            const data = await response.json();
            
            updateWeatherUI(cityInfo.city, data.current);
            
            hideLoader();
            weatherCard.style.position = 'relative'; // pop back into flow
            // small timeout to ensure display state triggers transition
            setTimeout(() => {
                weatherCard.classList.remove('hidden');
            }, 50);
        } catch (error) {
            hideLoader();
            showError('Не удалось загрузить погодные данные.');
        }
    }

    function updateWeatherUI(cityName, current) {
        cityNameEl.textContent = cityName;
        tempValueEl.textContent = Math.round(current.temperature_2m);
        feelsLikeEl.textContent = `${Math.round(current.apparent_temperature)}°C`;
        humidityEl.textContent = `${Math.round(current.relative_humidity_2m)}%`;
        windEl.textContent = `${Math.round(current.wind_speed_10m)} м/с`;
        
        // interpret weather code
        const isDay = current.is_day === 1;
        let wInfo = weatherCodes[current.weather_code] || { desc: 'Неизвестно', icon: isDay ? '☀️' : '🌙' };
        
        // Adjust icon to night if necessary
        if (!isDay && wInfo.icon === '☀️') wInfo.icon = '🌙';
        if (!isDay && wInfo.icon === '🌤️') wInfo.icon = '🌥️';
        if (!isDay && wInfo.icon === '⛅') wInfo.icon = '☁️';
        
        weatherDescEl.textContent = wInfo.desc;
        weatherIconEl.textContent = wInfo.icon;
    }

    function showLoader() {
        loader.classList.remove('hidden');
    }

    function hideLoader() {
        loader.classList.add('hidden');
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
    }
});
