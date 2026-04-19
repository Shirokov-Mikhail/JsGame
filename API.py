from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Разрешаем CORS, чтобы ваш JS (даже из локального файла) мог делать запросы
CORS(app)

# Список для хранения данных (в реальном проекте тут будет база данных)
players_results = []

@app.route('/players', methods=['POST'])
def save_result():
    try:
        # Получаем JSON из тела запроса
        data = request.get_json()

        # Извлекаем данные
        name = data.get('name')
        duration = data.get('play_duration')
        crystals = data.get('crystals')

        # Логируем для проверки в консоли сервера
        print(f"Получены данные: Игрок: {name}, Время: {duration}, Кристаллы: {crystals}")

        # Сохраняем (например, в список)
        players_results.append({
            "name": name,
            "play_duration": duration,
            "crystals": crystals
        })

        return jsonify({"status": "success", "message": "Результат сохранен"}), 201

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == '__main__':
    # Запуск на всех интерфейсах (0.0.0.0) и порту 6060
    app.run(host='0.0.0.0', port=6060)