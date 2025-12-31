# El tiempo en la montaña (Mountain Weather)

A specialized weather application for mountain enthusiasts in Spain, providing real-time data directly from the **AEMET (Agencia Estatal de Meteorología)** OpenData API.

## 🏔 Features

- **Poblaciones (Towns & Valleys)**: Dynamic search and forecast for over 8,000 Spanish municipalities.
- **Montaña (Mountain Peaks)**: Detailed nivological (snow) and meteorological reports for key mountain ranges (Pyrenees).
- **Hourly Evolution**: Intelligent 12-hour forecast tracking across day boundaries.
- **Night Mode Visuals**: Context-aware iconography that switches between day and night based on official AEMET codes.
- **Avalanche Risk Analysis**: Automated parsing of snow conditions and danger levels.
- **Premium UI**: Modern, high-performance interface built with Tailwind CSS v4 and specialized weather aesthetics.

## 🚀 Technology Stack

- **Core**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Fetching**: [@tanstack/react-query](https://tanstack.com/query/latest) (with 24h/1h smart caching)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## 🛠 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [pnpm](https://pnpm.io/)

### Steps
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mountain-weather
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Get an AEMET API Key**:
   Register at [AEMET OpenData](https://opendata.aemet.es/) and obtain your key.

4. **Configuration**:
   Add your API key in `src/config/aemet.ts`:
   ```typescript
   export const API_KEY = "YOUR_API_KEY_HERE";
   ```

5. **Start Development Server**:
   ```bash
   pnpm dev
   ```

6. **Build for Production**:
   ```bash
   pnpm build
   ```

## 🏗 Architecture

The project follows SOLID principles and a clean architecture approach:
- **Infrastructure**: Robust `httpClient` with automatic text decoding (UTF-8/ISO-8859-1) and JSON parsing fallbacks.
- **Business Logic**: Specialized hooks like `useWeather` and `useMunicipios` leveraging React Query for state management.
- **Presentation**: Modular components with a focus on visual excellence and responsive design.

## 📄 License
This project uses public data from AEMET. All information must be reproduced citing AEMET as the author.
