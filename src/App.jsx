import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Property3D from './pages/Property3D';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import WalletConnector from './components/web3/WalletConnector';
import { usePersistedState } from './utils/Helpers';

function App() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = usePersistedState("theme", prefersDark ? "dark" : "light"); // Temporary, I recomend to use redux state with backend synth
  const [walletAddress, setWalletAddress] = useState(null);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar
          onConnectClick={() => setWalletModalOpen(true)}
          theme={theme}
          setTheme={setTheme}
          walletAddress={walletAddress}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home
              theme={theme}
              onConnectClick={() => setWalletModalOpen(true)}
              walletAddress={walletAddress}
            />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/property-3d" element={<Property3D />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path = '*' element={<NotFound/>} />
          </Routes>
        </main>
        <Footer />
        <WalletConnector
          isOpen={walletModalOpen}
          onClose={() => setWalletModalOpen(false)}
          theme={theme}
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
        />
      </div>
    </Router>
  );
}

export default App;