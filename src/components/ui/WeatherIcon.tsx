import { Sun, Snowflake, CloudRain, Cloud, Moon, CloudMoon, CloudSun, CloudLightning } from 'lucide-react';

interface WeatherIconProps {
  condition?: string;
  icon?: string;
  size?: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, icon, size = 24 }) => {
  const c = condition?.toLowerCase() || '';
  const isNight = icon?.endsWith('n');
  
  // AEMET icons: 11 (clear), 12-14 (clouds), 15-17 (cloudy), 43-46 (rain), 23-26 (snow)
  
  if (c.includes('tormenta')) return <CloudLightning size={size} className="text-yellow-500" />;
  if (c.includes('nieve')) return <Snowflake size={size} className="text-blue-200" />;
  if (c.includes('lluvia')) return <CloudRain size={size} className="text-blue-400" />;
  
  if (c.includes('despejado') || c.includes('sol')) {
    return isNight 
      ? <Moon size={size} className="text-indigo-200" />
      : <Sun size={size} className="text-yellow-400" />;
  }
  
  if (c.includes('nubes') || c.includes('nuboso')) {
    if (isNight) return <CloudMoon size={size} className="text-slate-400" />;
    return <CloudSun size={size} className="text-slate-400" />;
  }

  if (c.includes('cubierto')) return <CloudRain size={size} className="text-blue-400 opacity-80" />;

  return <Cloud size={size} className="text-slate-400" />;
};

export default WeatherIcon;
