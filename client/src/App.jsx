import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import InvestigationPage from './pages/InvestigationPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/investigation/:id" element={<InvestigationPage />} />
    </Routes>
  );
}
