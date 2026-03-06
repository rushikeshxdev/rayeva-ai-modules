import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductTagger from './pages/ProductTagger';
import ProposalGenerator from './pages/ProposalGenerator';
import ImpactReport from './pages/ImpactReport';
import WhatsAppBot from './pages/WhatsAppBot';

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tagger" element={<ProductTagger />} />
          <Route path="/proposal" element={<ProposalGenerator />} />
          <Route path="/impact" element={<ImpactReport />} />
          <Route path="/whatsapp" element={<WhatsAppBot />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
