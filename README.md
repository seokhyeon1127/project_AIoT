# 스마트 빨래 건조 시스템

## 프로젝트 개요
아두이노와 IoT 센서를 활용하여 빨래의 건조 상태를 실시간으로 모니터링하고 AI 모델을 통해 남은 건조 시간을 예측하는 시스템이다.

## 사용 기술
- Arduino UNO
- DHT11
- 토양 수분 센서
- Python Flask
- Random Forest
- React
- TypeScript

## 시스템 구성

수분센서 → Arduino

DHT11 → Arduino

Arduino → Flask

Flask → Random Forest

Random Forest → React Dashboard

## 실행 방법
아두이노 연결 및 업로드
backend terminal에서 python app.py 
http://localhost:5000/data 접속
루트(laundry-dashboard)에서 npm run dev 
http://localhost:5173/ 접속