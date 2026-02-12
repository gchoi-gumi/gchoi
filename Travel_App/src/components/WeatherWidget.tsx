import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  isMock: boolean;
  error?: string;
}

interface WeatherWidgetProps {
  city: string;
  compact?: boolean;
}

// Map Korean city names to English
const cityNameMap: Record<string, string> = {
  "서울": "Seoul",
  "부산": "Busan",
  "대구": "Daegu",
  "인천": "Incheon",
  "광주": "Gwangju",
  "대전": "Daejeon",
  "울산": "Ulsan",
  "세종": "Sejong",
  "경기": "Suwon",
  "강원": "Chuncheon",
  "충북": "Cheongju",
  "충남": "Daejeon",
  "전북": "Jeonju",
  "전남": "Gwangju",
  "경북": "Daegu",
  "경남": "Changwon",
  "제주": "Jeju",
  "제주특별자치도": "Jeju",
  "제주도": "Jeju",
  "서울특별시": "Seoul",
  "부산광역시": "Busan",
  "대구광역시": "Daegu",
  "인천광역시": "Incheon",
  "광주광역시": "Gwangju",
  "대전광역시": "Daejeon",
  "울산광역시": "Ulsan",
  "세종특별자치시": "Sejong",
  "경기도": "Suwon",
  "강원도": "Chuncheon",
  "충청북도": "Cheongju",
  "충청남도": "Daejeon",
  "전라북도": "Jeonju",
  "전라남도": "Gwangju",
  "경상북도": "Daegu",
  "경상남도": "Changwon",
  "강릉": "Gangneung",
  "전주": "Jeonju",
  "경주": "Gyeongju",
  "여수": "Yeosu",
  "포항": "Pohang",
  "창원": "Changwon",
  "천안": "Cheonan",
  "청주": "Cheongju",
  "안산": "Ansan",
  "안양": "Anyang",
  "수원": "Suwon",
  "용인": "Yongin",
  "성남": "Seongnam",
  "고양": "Goyang",
  "화성": "Hwaseong",
  "남양주": "Namyangju",
  "부천": "Bucheon",
  "평택": "Pyeongtaek",
  "시흥": "Siheung",
  "파주": "Paju",
  "김해": "Gimhae",
  "진주": "Jinju",
  "통영": "Tongyeong",
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ city, compact = false }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const englishCity = cityNameMap[city] || city;
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70/weather/${encodeURIComponent(englishCity)}`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.weather) {
          setWeather(data.weather);
        } else {
          throw new Error('Invalid response');
        }
        
      } catch (err) {
        setWeather({
          temperature: 20,
          description: '맑음',
          icon: '01d',
          humidity: 60,
          windSpeed: 2.5,
          isMock: true
        });
      } finally {
        setLoading(false);
      }
    };

    if (city && city.trim()) {
      fetchWeather();
    } else {
      // Set fallback data immediately
      setWeather({
        temperature: 20,
        description: '날씨 정보 없음',
        icon: '01d',
        humidity: 60,
        windSpeed: 2.5,
        isMock: true
      });
      setLoading(false);
    }
  }, [city]);

  const getWeatherIcon = (iconCode: string) => {
    // OpenWeather icon codes
    const code = iconCode.substring(0, 2);
    
    switch (code) {
      case '01': return <Sun className="w-8 h-8 text-yellow-400" />;
      case '02': return <Cloud className="w-8 h-8 text-gray-400" />;
      case '03': return <Cloud className="w-8 h-8 text-gray-500" />;
      case '04': return <Cloud className="w-8 h-8 text-gray-600" />;
      case '09': return <CloudRain className="w-8 h-8 text-blue-400" />;
      case '10': return <CloudRain className="w-8 h-8 text-blue-500" />;
      case '11': return <CloudRain className="w-8 h-8 text-purple-500" />;
      case '13': return <CloudSnow className="w-8 h-8 text-blue-200" />;
      default: return <Sun className="w-8 h-8 text-yellow-400" />;
    }
  };

  const getWeatherGradient = (iconCode: string) => {
    const code = iconCode.substring(0, 2);
    
    switch (code) {
      case '01': return 'from-yellow-100 to-orange-100';
      case '02':
      case '03':
      case '04': return 'from-gray-100 to-gray-200';
      case '09':
      case '10':
      case '11': return 'from-blue-100 to-blue-200';
      case '13': return 'from-blue-50 to-blue-100';
      default: return 'from-sky-100 to-blue-100';
    }
  };

  if (loading) {
    return (
      <Card className={`bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse ${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
            <div>
              <div className="w-16 h-4 bg-gray-300 rounded mb-2" />
              <div className="w-24 h-3 bg-gray-300 rounded" />
            </div>
          </div>
          {!compact && (
            <div className="w-12 h-8 bg-gray-300 rounded" />
          )}
        </div>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  if (compact) {
    return (
      <Card className={`bg-gradient-to-r ${getWeatherGradient(weather.icon)} p-3 shadow-md relative overflow-hidden`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.icon)}
            <div>
              <span className="text-2xl">{weather.temperature}°</span>
              <p className="text-sm text-gray-600">{weather.description}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-r ${getWeatherGradient(weather.icon)} p-4 shadow-md relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {getWeatherIcon(weather.icon)}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl">{weather.temperature}°</span>
            </div>
            <p className="text-sm text-gray-600">{weather.description}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Droplets className="w-4 h-4" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-4 h-4" />
          <span>{weather.windSpeed}m/s</span>
        </div>
      </div>
    </Card>
  );
};
