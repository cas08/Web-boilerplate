import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import WeatherCard from "./WeatherCard";
import {
  getWeatherByCity,
  getWeatherByCoords,
  getCurrentPosition,
} from "../utils/api";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sun, LogOut, RefreshCcw, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useGeolocation, setUseGeolocation] = useState(false);

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchWeatherData();
  }, [useGeolocation]);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (useGeolocation) {
        try {
          const position = await getCurrentPosition();
          data = await getWeatherByCoords(position.lat, position.lon);
        } catch (geoError) {
          data = await getWeatherByCity("Berlin");
        }
      } else {
        data = await getWeatherByCity("Berlin");
      }
      setWeatherData(data);
    } catch (err) {
      setError("Не вдалося завантажити дані погоди. Спробуйте пізніше.");
    } finally {
      setLoading(false);
    }
  };

  const getDailyForecasts = () => {
    if (!weatherData?.daily?.time) {
      return [];
    }

    const {
      time,
      weathercode,
      temperature_2m_max,
      temperature_2m_min,
      wind_speed_10m_max,
      precipitation_probability_mean,
    } = weatherData.daily;

    return time.map((date, index) => ({
      date: date,
      code: weathercode[index],
      tempMax: temperature_2m_max[index],
      tempMin: temperature_2m_min[index],
      windSpeed: wind_speed_10m_max[index],
      precipitationProbability: precipitation_probability_mean[index],
    }));
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6" />
          <p className="text-xl font-medium">Завантаження даних погоди...</p>
          <p className="mt-2">Отримуємо актуальну інформацію</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Панель погоди</h1>
                <p className="text-sm">Прогноз на 5 днів</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm">Вітаємо,</p>
                <p className="font-semibold">{user?.username}</p>
              </div>
              <Button variant="secondary" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                <span>Вийти</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <Switch
              id="geolocation-toggle"
              checked={useGeolocation}
              onCheckedChange={setUseGeolocation}
              className="data-[state=checked]:bg-primary-500"
            />
            <Label htmlFor="geolocation-toggle" className="text-sm font-medium">
              Використовувати геолокацію
            </Label>
          </div>
          <Button
            variant="secondary"
            onClick={fetchWeatherData}
            className="bg-white/20 hover:bg-white/30"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            <span>Оновити дані</span>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Помилка завантаження</AlertTitle>
            <AlertDescription>
              {error}
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchWeatherData}
                className="mt-3 bg-transparent border border-red-500 hover:bg-red-500/20"
              >
                Спробувати знову
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {weatherData && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                Прогноз погоди для{" "}
                {weatherData.cityName ||
                  (useGeolocation ? "вашого місця" : "Берліна")}
              </h2>
              <p className="">5-денний детальний прогноз</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {getDailyForecasts().map((dayData, index) => (
                <WeatherCard
                  key={dayData.date}
                  weatherData={dayData}
                  isToday={index === 0}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
