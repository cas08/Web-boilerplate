import axios from "axios";

const dailyParams =
  "weathercode,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_probability_mean";

const forecastApi = axios.create({
  baseURL: "https://api.open-meteo.com/v1/",
  params: {
    daily: dailyParams,
    temperature_unit: "celsius",
    timezone: "auto",
    forecast_days: 5,
    wind_speed_unit: "kmh",
  },
});

const geocodingApi = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1/",
  params: {
    count: 1,
    language: "uk",
  },
});

export const getWeatherByCoords = async (lat, lon) => {
  try {
    const response = await forecastApi.get("/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather by coords:", error);
    throw error;
  }
};

export const getWeatherByCity = async (city = "Berlin") => {
  try {
    const geoResponse = await geocodingApi.get("/search", {
      params: {
        name: city,
      },
    });

    const location = geoResponse.data.results?.[0];
    if (!location) {
      throw new Error(`Місто '${city}' не знайдено.`);
    }

    const { latitude, longitude, name } = location;

    const weatherData = await getWeatherByCoords(latitude, longitude);

    return { ...weatherData, cityName: name };
  } catch (error) {
    console.error(`Error fetching weather for city ${city}:`, error);
    throw error;
  }
};

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Геолокація не підтримується"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 27000,
        maximumAge: 30000,
      }
    );
  });
};
