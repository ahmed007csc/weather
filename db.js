const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'weather.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country TEXT NOT NULL,
        city TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
    )`);

    const stmt = db.prepare("INSERT INTO locations (country, city, latitude, longitude) VALUES (?, ?, ?, ?)");
    
    const locations = [
        { country: "Россия", city: "Москва", lat: 55.7558, lon: 37.6173 },
        { country: "Россия", city: "Санкт-Петербург", lat: 59.9343, lon: 30.3351 },
        { country: "Россия", city: "Владивосток", lat: 43.1198, lon: 131.8869 },
        { country: "Россия", city: "Новосибирск", lat: 55.0084, lon: 82.9357 },
        { country: "Россия", city: "Казань", lat: 55.7963, lon: 49.1088 },
        { country: "Казахстан", city: "Астана", lat: 51.1694, lon: 71.4491 },
        { country: "Казахстан", city: "Алматы", lat: 43.222, lon: 76.8512 },
        { country: "Казахстан", city: "Шымкент", lat: 42.3417, lon: 69.5901 },
        { country: "Беларусь", city: "Минск", lat: 53.9006, lon: 27.5590 },
        { country: "США", city: "Нью-Йорк", lat: 40.7128, lon: -74.0060 },
        { country: "США", city: "Лос-Анджелес", lat: 34.0522, lon: -118.2437 },
        { country: "Великобритания", city: "Лондон", lat: 51.5074, lon: -0.1278 },
        { country: "Германия", city: "Берлин", lat: 52.5200, lon: 13.4050 },
        { country: "Франция", city: "Париж", lat: 48.8566, lon: 2.3522 },
        { country: "Япония", city: "Токио", lat: 35.6762, lon: 139.6503 },
        { country: "Китай", city: "Пекин", lat: 39.9042, lon: 116.4074 },
        { country: "ОАЭ", city: "Дубай", lat: 25.2048, lon: 55.2708 },
        { country: "Кыргызстан", city: "Бишкек", lat: 42.8747, lon: 74.5698 },
        { country: "Кыргызстан", city: "Ош", lat: 40.514, lon: 72.8161 },
        { country: "Кыргызстан", city: "Джалал-Абад", lat: 40.9333, lon: 73.0 },
        { country: "Кыргызстан", city: "Каракол", lat: 42.4907, lon: 78.3936 },
        { country: "Кыргызстан", city: "Нарын", lat: 41.4287, lon: 75.9911 },
        { country: "Кыргызстан", city: "Талас", lat: 42.5228, lon: 72.2427 },
        { country: "Кыргызстан", city: "Баткен", lat: 40.0625, lon: 70.8194 },
        { country: "Кыргызстан", city: "Чолпон-Ата", lat: 42.6477, lon: 77.0811 }
    ];

    db.get("SELECT COUNT(*) as count FROM locations WHERE country = 'Кыргызстан'", (err, row) => {
        if (err) {
            console.error(err);
        } else if (row.count === 0) {
            locations.forEach(loc => {
                // Use INSERT OR IGNORE or just filter for new ones
                db.get("SELECT id FROM locations WHERE city = ? AND country = ?", [loc.city, loc.country], (err, exists) => {
                    if (!exists) {
                        stmt.run(loc.country, loc.city, loc.lat, loc.lon);
                    }
                });
            });
            console.log("Database updated with new potential locations.");
        } else {
            console.log("Kyrgyzstan already in database.");
        }
    });
});

module.exports = db;
