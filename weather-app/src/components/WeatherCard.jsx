import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  Snowflake,
  CloudSnow,
  CloudLightning,
  Wind,
  Umbrella,
} from "lucide-react";

const getWeatherInfo = (code) => {
  switch (true) {
    // 0: Ясно
    case code === 0:
      return { description: "Ясно", Icon: Sun };

    // 1, 2: Мінлива хмарність
    case code === 1 || code === 2:
      return { description: "Мінлива хмарність", Icon: CloudSun };

    // 3: Хмарно
    case code === 3:
      return { description: "Хмарно", Icon: Cloud };

    // 45, 48: Туман
    case code === 45 || code === 48:
      return { description: "Туман", Icon: CloudFog };

    // 51, 53, 55: Мряка
    case code === 51 || code === 53 || code === 55:
      return { description: "Мряка", Icon: CloudDrizzle };

    // 56, 57: Крижана мряка
    case code === 56 || code === 57:
      return { description: "Крижана мряка", Icon: Snowflake };

    // 61, 63, 65: Дощ
    case code === 61 || code === 63 || code === 65:
      return { description: "Дощ", Icon: CloudRain };

    // 66, 67: Крижаний дощ
    case code === 66 || code === 67:
      return { description: "Крижаний дощ", Icon: Snowflake };

    // 71, 73, 75, 77: Сніг
    case code === 71 || code === 73 || code === 75 || code === 77:
      return { description: "Сніг", Icon: CloudSnow };

    // 80, 81, 82: Злива
    case code === 80 || code === 81 || code === 82:
      return { description: "Злива", Icon: CloudRainWind };

    // 85, 86: Снігопад (зливовий сніг)
    case code === 85 || code === 86:
      return { description: "Снігопад", Icon: CloudSnow };

    // 95, 96, 99: Гроза
    case code === 95 || code === 96 || code === 99:
      return { description: "Гроза", Icon: CloudLightning };

    default:
      return { description: "Хмарно", Icon: Cloud };
  }
};

const WeatherCard = ({ weatherData, isToday }) => {
  const {
    date: dateString,
    code,
    tempMax,
    tempMin,
    windSpeed,
    precipitationProbability,
  } = weatherData;

  const date = new Date(dateString);
  const dayName = isToday
    ? "Сьогодні"
    : date.toLocaleDateString("uk-UA", {
        weekday: "long",
      });

  const fullDate = date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
  });

  const { description, Icon } = getWeatherInfo(code);

  const maxTemp = Math.round(tempMax);
  const minTemp = Math.round(tempMin);
  const windSpeedValue = Math.round(windSpeed);
  const precipitationValue = Math.round(precipitationProbability);

  return (
    <Card className={cn("weather-card", isToday && "weather-card-today")}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg font-semibold capitalize">
          {dayName}
        </CardTitle>
        <CardDescription className="text-sm">{fullDate}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center mb-4">
          <Icon className="w-16 h-16 drop-shadow-lg" />
        </div>

        <div className="text-center mb-4">
          <div className="text-2xl font-bold mb-1">
            {maxTemp}° / {minTemp}°
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="capitalize font-medium text-sm">{description}</p>
        </div>

        <div className="space-y-2 pt-2 border-t border-white/20">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <Wind className="w-3 h-3" />
              <span>Вітер</span>
            </div>
            <span className="font-medium">{windSpeedValue} км/г</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <Umbrella className="w-3 h-3" />
              <span>Опади</span>
            </div>
            <span className="font-medium">{precipitationValue}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
