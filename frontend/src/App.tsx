import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AppDataProvider } from './context/AppDataContext';
import { ToastProvider } from './context/ToastContext';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';
import GeneratorPage from './pages/GeneratorPage';
import GeneratedSitesPage from './pages/GeneratedSitesPage';
import FavoritesPage from './pages/FavoritesPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <AppDataProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Dashboard />} />
              <Route path="/buscar" element={<SearchPage />} />
              <Route path="/gerador" element={<GeneratorPage />} />
              <Route path="/sites-gerados" element={<GeneratedSitesPage />} />
              <Route path="/favoritos" element={<FavoritesPage />} />
              <Route path="/configuracoes" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppDataProvider>
  );
}
