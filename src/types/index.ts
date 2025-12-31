export interface WeatherData {
  municipio?: string;
  prediccion?: {
    dia: DayPrediction[];
    texto?: {                 // Added this
      propia: string;
    };
  };
   // Specific for mountain view response structure which differs
   nombre?: string; 
   texto?: {
     propia: string;
   }
   seccion?: {
     apartado: any[];
     lugar: any[];
     parrafo: {
       texto: string;
       numero: string;
     }[];
     nombre: string;
   }[];
   elaborado?: string;
   provincia?: string;
   id?: string;
}

export interface DayPrediction {
  estadoCielo: { value: string; descripcion: string; periodo: string }[];
  precipitacion: { value: string; periodo: string }[];
  probPrecipitacion: { value: string; periodo: string }[];
  temperatura: { value: string; periodo: string }[];
  sensTermica: { value: string; periodo: string }[];
  humedadRelativa: { value: string; periodo: string }[];
  vientoAndRachaMax: ({
    direccion?: string[];
    velocidad?: string[];
    value?: string;
    periodo: string;
  })[];
  fecha: string;
  orto: string;
  ocaso: string;
}


export interface LocationItem {
  id: string;
  name: string;
  type: 'municipio' | 'montana';
}

export type TabType = 'localidad' | 'zona';
