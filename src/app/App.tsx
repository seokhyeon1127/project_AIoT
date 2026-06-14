import { useState, useEffect } from "react";
import {
  Activity,
  Droplets,
  Thermometer,
  Wind,
  Clock,
  TrendingDown,
  Download,
  Settings,
  BarChart3,
  Home,
  LineChart,
  Database,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";
import { CircularProgress, Box, Typography } from "@mui/material";

// Mock data generator
const generateMockData = () => {
  const now = Date.now();
  const data = [];
  for (let i = 20; i >= 0; i--) {
    const timestampMs = now - i * 60000;
    const timestamp = new Date(timestampMs);
    data.push({
      id: `data-${timestampMs}`,
      timestamp: timestamp.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      moisturePercent: Math.max(10, 80 - i * 3 + Math.random() * 5),
      rawValue: Math.floor(400 + i * 15 + Math.random() * 20),
      temperature: 22 + Math.random() * 3,
      humidity: 45 + Math.random() * 10,
      status: i > 15 ? "젖음" : i > 5 ? "건조 중" : "건조 완료",
    });
  }
  return data;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sensorData, setSensorData] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [remainingTime, setRemainingTime] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data");

        const data = await response.json();

        const newEntry = {
          id: Date.now().toString(),

          timestamp: new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),

          moisturePercent: data.moisture,

          rawValue: data.raw,

          temperature: data.temperature,

          humidity: data.humidity,

          status:
            data.moisture > 50
              ? "매우 젖음"
              : data.moisture > 13
                ? "건조 중"
                : "건조 완료",
        };

        setSensorData((prev) => [...prev.slice(-20), newEntry]);

        setRemainingTime(data.remaining_time);

        setLastUpdate(new Date());
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  if (sensorData.length === 0) {
    return <div>데이터 수신 중...</div>;
  }

  const currentData = sensorData[sensorData.length - 1];
  const dryingProgress = Math.max(
    0,
    Math.min(100, ((80 - currentData.moisturePercent) / (80 - 13)) * 100),
  );

  const StatusCard = ({ title, value, unit, icon: Icon, trend }: any) => (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">{title}</span>
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl">{value}</span>
        <span className="text-gray-500 text-lg mb-1">{unit}</span>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
          <TrendingDown className="w-4 h-4" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );

  const Sidebar = () => (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl text-blue-600">스마트 빨래 건조</h1>
        <p className="text-sm text-gray-500">Smart Laundry System</p>
      </div>

      <nav className="flex-1 p-4">
        <button
          onClick={() => setCurrentPage("dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
            currentPage === "dashboard"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>실시간 모니터링</span>
        </button>

        {/* <button
          onClick={() => setCurrentPage('analysis')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
            currentPage === 'analysis' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>실험 데이터 분석</span>
        </button> */}

        <button
          onClick={() => setCurrentPage("prediction")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
            currentPage === "prediction"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <LineChart className="w-5 h-5" />
          <span>건조 시간 예측</span>
        </button>

        <button
          onClick={() => setCurrentPage("data")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
            currentPage === "data"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Database className="w-5 h-5" />
          <span>데이터 기록</span>
        </button>

        <button
          onClick={() => setCurrentPage("settings")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
            currentPage === "settings"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>설정</span>
        </button>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div>System Version: v1.0.0</div>
          <div className="mt-1">Arduino Uno + DHT11</div>
        </div>
      </div>
    </div>
  );

  const Header = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">스마트 빨래 건조 시스템</h1>
          <p className="text-sm text-gray-500">
            실시간 환경 모니터링 및 건조 예측
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span className="text-sm text-gray-700">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <div>마지막 업데이트</div>
            <div>{lastUpdate.toLocaleTimeString("ko-KR")}</div>
          </div>

          <div className="text-sm text-gray-600">
            <div>실험명</div>
            <div className="text-blue-600">일반 실내 건조</div>
          </div>

          <div className="flex items-center gap-2 text-sm text-green-600">
            <Activity className="w-4 h-4" />
            <span>데이터 저장 중</span>
          </div>
        </div>
      </div>
    </div>
  );

  const DashboardPage = () => (
    <div className="p-6 space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatusCard
          title="현재 수분값"
          value={currentData.moisturePercent.toFixed(1)}
          unit="%"
          icon={Droplets}
          trend="감소 중"
        />
        <StatusCard
          title="현재 원시값"
          value={currentData.rawValue}
          unit="raw"
          icon={Activity}
        />
        <StatusCard
          title="현재 온도"
          value={currentData.temperature.toFixed(1)}
          unit="°C"
          icon={Thermometer}
        />
        <StatusCard
          title="현재 습도"
          value={currentData.humidity.toFixed(1)}
          unit="%"
          icon={Wind}
        />
      </div>

      {/* Drying Status and Environment */}
      <div className="grid grid-cols-3 gap-4">
        {/* Drying Status */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h3 className="text-lg mb-4">건조 상태</h3>

          <div className="flex flex-col items-center">
            <Box position="relative" display="inline-flex" className="mb-4">
              <CircularProgress
                variant="determinate"
                value={dryingProgress}
                size={120}
                thickness={4}
                sx={{ color: dryingProgress > 80 ? "#10b981" : "#3b82f6" }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h4" component="div" color="text.primary">
                  {Math.round(dryingProgress)}%
                </Typography>
              </Box>
            </Box>

            <div className="text-center">
              <div
                className={`text-lg mb-2 ${
                  currentData.status === "건조 완료"
                    ? "text-green-600"
                    : currentData.status === "건조 중"
                      ? "text-blue-600"
                      : "text-orange-600"
                }`}
              >
                {currentData.status}
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>남은 시간: {remainingTime}분</span>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                건조 완료 기준: 수분 ≤ 13%, 30분 이상 지속
              </div>
            </div>
          </div>
        </div>

        {/* Environment Conditions */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h3 className="text-lg mb-4">환경 조건</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">실험 환경</span>
              <span className="text-blue-600">일반 실내</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">평균 온도</span>
              <span>
                {(
                  sensorData.reduce((acc, d) => acc + d.temperature, 0) /
                  sensorData.length
                ).toFixed(1)}
                °C
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">평균 습도</span>
              <span>
                {(
                  sensorData.reduce((acc, d) => acc + d.humidity, 0) /
                  sensorData.length
                ).toFixed(1)}
                %
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">경과 시간</span>
              <span>63분</span>
            </div>
          </div>
        </div>

        {/* Prediction Results */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h3 className="text-lg mb-4">예측 결과</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">예상 완료 시각</span>
              <span className="text-blue-600">
                {new Date(
                  Date.now() + remainingTime * 60000,
                ).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">남은 시간</span>
              <span>{remainingTime}분</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">평균 예측 오차</span>
              <span className="text-green-600">8분</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">사용 모델</span>
              <span className="text-sm">랜덤 포레스트</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4">
        {/* Moisture Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h3 className="text-lg mb-4">시간에 따른 수분값 변화</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsLineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                key="moisture-line"
                type="monotone"
                dataKey="moisturePercent"
                stroke="#3b82f6"
                name="수분값 (%)"
                strokeWidth={2}
                dot={false}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature & Humidity Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h3 className="text-lg mb-4">시간에 따른 온도·습도 변화</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsLineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                key="temperature-line"
                type="monotone"
                dataKey="temperature"
                stroke="#ef4444"
                name="온도 (°C)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                key="humidity-line"
                type="monotone"
                dataKey="humidity"
                stroke="#10b981"
                name="습도 (%)"
                strokeWidth={2}
                dot={false}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const AnalysisPage = () => {
    const comparisonData = [
      {
        id: "indoor",
        environment: "일반 실내",
        dryingTime: 120,
        avgTemp: 23,
        avgHumidity: 50,
      },
      {
        id: "sunny",
        environment: "햇빛 실내",
        dryingTime: 85,
        avgTemp: 26,
        avgHumidity: 42,
      },
      {
        id: "rainy",
        environment: "비오는날",
        dryingTime: 165,
        avgTemp: 21,
        avgHumidity: 68,
      },
    ];

    return (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl" font-bold>실험 데이터 분석</h2>

        {/* Environment Comparison */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h3 className="text-lg mb-4">환경별 건조 시간 비교</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="environment" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                key="drying-time-bar"
                dataKey="dryingTime"
                fill="#3b82f6"
                name="건조 시간 (분)"
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h4 className="text-gray-600 mb-2">일반 실내</h4>
            <div className="text-3xl text-blue-600 mb-1">120분</div>
            <div className="text-sm text-gray-500">평균 건조 시간</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h4 className="text-gray-600 mb-2">햇빛이 드는 실내</h4>
            <div className="text-3xl text-orange-600 mb-1">85분</div>
            <div className="text-sm text-gray-500">평균 건조 시간</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h4 className="text-gray-600 mb-2">비 오는 날 실내</h4>
            <div className="text-3xl text-gray-600 mb-1">165분</div>
            <div className="text-sm text-gray-500">평균 건조 시간</div>
          </div>
        </div>
      </div>
    );
  };

  const PredictionPage = () => {
    const [inputs, setInputs] = useState({
      moisture: currentData.moisturePercent.toFixed(1),
      temperature: currentData.temperature.toFixed(1),
      humidity: currentData.humidity.toFixed(1),
    });

    const predictedTime = Math.max(
      0,
      Math.floor((parseFloat(inputs.moisture) - 13) * 2),
    );
    const predictedCompletion = new Date(Date.now() + predictedTime * 60000);

    return (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl" font-bold>건조 시간 예측</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h3 className="text-lg mb-4">현재 상태 입력</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  현재 수분값 (%)
                </label>
                <input
                  type="number"
                  value={inputs.moisture}
                  onChange={(e) =>
                    setInputs({ ...inputs, moisture: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  현재 온도 (°C)
                </label>
                <input
                  type="number"
                  value={inputs.temperature}
                  onChange={(e) =>
                    setInputs({ ...inputs, temperature: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  현재 습도 (%)
                </label>
                <input
                  type="number"
                  value={inputs.humidity}
                  onChange={(e) =>
                    setInputs({ ...inputs, humidity: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Prediction Results */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h3 className="text-lg mb-4">예측 결과</h3>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  예상 남은 건조 시간
                </div>
                <div className="text-3xl text-blue-600">{predictedTime}분</div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  예상 건조 완료 시각
                </div>
                <div className="text-2xl text-green-600">
                  {predictedCompletion.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div className="text-sm text-gray-500 mt-4">
                * 예측은 현재 환경 조건이 유지된다고 가정합니다
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DataPage = () => (
    
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
        <h2 className="text-2xl" font-bold>데이터 기록</h2>
        <p className="text-sm text-gray-500">
          총 {sensorData.length}개의 데이터
        </p>
      </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105">
          <Download className="w-4 h-4" />
          CSV 다운로드
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Moisture (%)
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Raw Value
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Temperature (°C)
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Humidity (%)
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sensorData.map((data) => (
                <tr
                 key={data.id}
                className="
                hover:bg-blue-50
                even:bg-gray-50
                transition-colors
                duration-200
                "
>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {data.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {data.moisturePercent.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {data.rawValue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {data.temperature.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {data.humidity.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        data.status === "건조 완료"
                          ? "bg-green-100 text-green-800"
                          : data.status === "건조 중"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {data.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SettingsPage = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl" font-bold>시스템 설정</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h3 className="text-lg mb-4">Arduino 연결 설정</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                COM 포트
              </label>
              <input
                type="text"
                defaultValue="COM3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Baud Rate
              </label>
              <input
                type="text"
                defaultValue="9600"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h3 className="text-lg mb-4">측정 설정</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                측정 주기 (초)
              </label>
              <input
                type="number"
                defaultValue="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                건조 완료 기준 (%)
              </label>
              <input
                type="number"
                defaultValue="13"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h3 className="text-lg mb-4">서버 설정</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                서버 주소
              </label>
              <input
                type="text"
                defaultValue="http://localhost:8000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                WebSocket 포트
              </label>
              <input
                type="text"
                defaultValue="8000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h3 className="text-lg mb-4">데이터 저장</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                저장 경로
              </label>
              <input
                type="text"
                defaultValue="./data/laundry_data.csv"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              설정 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          {currentPage === "dashboard" && <DashboardPage />}
          {currentPage === "analysis" && <AnalysisPage />}
          {currentPage === "prediction" && <PredictionPage />}
          {currentPage === "data" && <DataPage />}
          {currentPage === "settings" && <SettingsPage />}
        </div>
      </div>
    </div>
  );
}
