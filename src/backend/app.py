from flask import Flask, jsonify
from flask_cors import CORS
import joblib
import serial
from datetime import datetime

app = Flask(__name__)
CORS(app)

# 랜덤포레스트 모델 불러오기
model = joblib.load("random_forest_model.pkl")

# 아두이노 연결
arduino = serial.Serial(
    'COM3',
    9600,
    timeout=2
)

@app.route("/data")
def get_data():

    try:

        # CSV 데이터가 나올 때까지 읽기
        while True:

            line = arduino.readline().decode(
                'utf-8',
                errors='ignore'
            ).strip()

            if line.count(",") >= 4:
                break

        parts = line.split(",")

        raw = int(parts[0])
        moisture = int(parts[1])
        temperature = float(parts[2])
        humidity = float(parts[3])

        hour = datetime.now().hour

        # =====================
        # 건조 완료 예외 처리
        # =====================
        if moisture <= 13:

            remaining_time = 0
            status = "건조 완료"

        else:

            prediction = model.predict([
                [
                    hour,
                    moisture,
                    temperature,
                    humidity
                ]
            ])

            remaining_time = round(prediction[0])

            # 사용자용 안전 마진
            remaining_time += 15

            status = "건조 중"

        return jsonify({
            "raw": raw,
            "moisture": moisture,
            "temperature": temperature,
            "humidity": humidity,
            "remaining_time": remaining_time,
            "status": status
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

if __name__ == "__main__":
    app.run(debug=False, port=5000)