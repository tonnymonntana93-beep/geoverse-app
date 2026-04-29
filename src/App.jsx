import React, { useState, useEffect } from 'react';
import { Settings, User, Map as MapIcon, MessageSquare, ShieldAlert, Globe, EyeOff, Coins, Search } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { toast, Toaster } from 'sonner';

const App = () => {
  const [view, setView] = useState('menu'); // 'menu' lub 'map'
  const [ghostMode, setGhostMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState('TOWARZYSKI');
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Mockowane dane z grafiki
  const mapNodes = [
    { id: 1, name: 'Master_Leon', status: 'Szukam grafika', type: 'TOWARZYSKI', x: 20, y: 40, rep: 4 },
    { id: 2, name: 'Sprzedam rower', status: 'Odbiór osobisty', type: 'HANDEL', x: 60, y: 30, rep: 5 },
    { id: 3, name: 'Naprawa PC', status: 'Dojazd do klienta', type: 'USLUGI', x: 40, y: 70, rep: 3 },
  ];

  useEffect(() => {
    Geolocation.requestPermissions();
  }, []);

  const toggleGhostMode = () => {
    setGhostMode(!ghostMode);
    toast(ghostMode ? "Jesteś widoczny na mapie" : "Tryb Ducha: Ukryto Twoją pozycję", {
      style: { fontFamily: '"Press Start 2P"', fontSize: '10px' }
    });
  };

  // --- WIDOK MENU GŁÓWNEGO ---
  if (view === 'menu') {
    return (
      <div className="h-screen bg-geo-bg text-white font-pixel flex flex-col items-center p-4 overflow-y-auto">
        <Toaster richColors />
        
        {/* Tytuł */}
        <div className="mt-8 mb-6 text-center">
          <h1 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-geo-neon-blue to-geo-neon-purple neon-text mb-2">GEOVERSE</h1>
          <p className="text-[10px] tracking-widest text-gray-400">TWOJE MIASTO, TWOJA GRA.</p>
        </div>

        {/* Centralny Ekran (Symulacja postaci) */}
        <div className="w-full h-64 bg-geo-panel pixel-border rounded-lg relative overflow-hidden mb-6 group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          {/* Pixel Art Postać */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-32 bg-blue-600 rounded-sm flex flex-col items-center justify-start pt-2 border-4 border-black">
             <div className="w-16 h-12 bg-orange-200 border-4 border-black mb-1"></div>
             <div className="w-20 h-12 bg-blue-800 border-4 border-black"></div>
          </div>
          {/* Dymek */}
          <div className="absolute top-10 right-10 bg-white text-black text-[8px] p-2 border-2 border-black rounded-sm shadow-[4px_4px_0_rgba(0,0,0,1)]">
             SPRZEDAM ROWER GÓRSKI
          </div>
        </div>

        {/* Przyciski Główne */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <button onClick={() => setView('map')} className="bg-purple-900 text-[10px] py-4 pixel-border active:scale-95 transition-transform">GRAJ!</button>
          <button className="bg-purple-900 text-[10px] py-4 pixel-border active:scale-95 transition-transform">KONTO</button>
          <button className="bg-purple-900 text-[10px] py-4 pixel-border active:scale-95 transition-transform">EKWIPUNEK</button>
          <button className="bg-purple-900 text-[10px] py-4 pixel-border active:scale-95 transition-transform">USTAWIENIA</button>
        </div>

        {/* Filtry i Dolny Pasek */}
        <div className="w-full">
          <p className="text-[10px] mb-3 text-geo-neon-blue">FILTRY</p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {['HANDEL', 'TOWARZYSKI', 'USLUGI', 'BAMICI'].map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} 
                className={`text-[8px] py-3 pixel-border flex items-center justify-center gap-2 ${activeFilter === f ? 'bg-geo-neon-blue text-black' : 'bg-geo-panel text-gray-400'}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-auto">
            <button onClick={toggleGhostMode} className={`text-[8px] py-3 px-4 pixel-border flex items-center gap-2 ${ghostMode ? 'bg-red-900' : 'bg-gray-800'}`}>
              <EyeOff size={12} /> TRYB DUCHA
            </button>
            <div className="flex flex-col items-center cursor-pointer" onClick={() => setView('map')}>
              <Globe size={24} className="text-gray-400 mb-1" />
              <span className="text-[8px] text-gray-400">MAPA ŚWIATA</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- WIDOK MAPY ŚWIATA ---
  return (
    <div className="h-screen bg-[#2c3e50] text-white font-pixel flex flex-col relative overflow-hidden">
      <Toaster richColors />
      
      {/* Top Bar na mapie */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-geo-panel/90 backdrop-blur-sm flex justify-between items-center z-10 border-b-4 border-black">
        <div className="flex items-center gap-2">
          <MapIcon size={16} />
          <span className="text-[10px]">CENTRUM, 50 OSÓB</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] flex items-center gap-1 text-yellow-400"><Coins size={12}/> 1010</span>
          <span className="text-[10px] bg-geo-neon-purple px-2 py-1 border-2 border-black">Lvl 80</span>
        </div>
      </div>

      {/* Kontener Mapy (Symulacja Izometryczna) */}
      <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] bg-[#34495e]" onClick={() => setSelectedUser(null)}>
        {/* Renderowanie Nodów na mapie */}
        {mapNodes.filter(n => n.type === activeFilter || activeFilter === 'TOWARZYSKI').map(node => (
          <div 
            key={node.id} 
            onClick={(e) => { e.stopPropagation(); setSelectedUser(node); }}
            className="absolute flex flex-col items-center cursor-pointer animate-bounce hover:scale-110 transition-transform"
            style={{ top: `${node.y}%`, left: `${node.x}%` }}
          >
            <div className="bg-white text-black text-[8px] p-1 border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] whitespace-nowrap mb-1">
              {node.name}
            </div>
            <div className={`w-6 h-6 border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] ${node.type === 'HANDEL' ? 'bg-orange-500' : 'bg-geo-neon-blue'}`}></div>
          </div>
        ))}
      </div>

      {/* Dolny Panel - Profil / Interakcja (Zgodny z grafiką) */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        {selectedUser ? (
          <div className="bg-geo-panel pixel-border p-4 animate-in slide-in-from-bottom-10">
            <div className="flex gap-4 mb-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-blue-900 border-2 border-geo-neon-blue flex items-center justify-center">
                 <User className="text-geo-neon-blue" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-[12px] text-geo-neon-blue mb-1">NAZWA: {selectedUser.name}</h3>
                <p className="text-[8px] text-gray-300 mb-2">STATUS: {selectedUser.status}</p>
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-[10px]">{i < selectedUser.rep ? '★' : '☆'}</span>)}
                </div>
              </div>
              <button className="bg-gray-800 text-[8px] px-2 h-8 border-2 border-gray-600 self-end">REPUTACJA</button>
            </div>
            <div className="flex justify-between gap-2">
              <button className="flex-1 bg-purple-900 text-[8px] py-2 border-2 border-purple-500">PROFIL</button>
              <button className="flex-1 bg-geo-neon-blue text-black text-[8px] py-2 border-2 border-black">CZAT</button>
              <button className="flex-1 bg-purple-900 text-[8px] py-2 border-2 border-purple-500">ZAPROŚ</button>
              <button className="bg-red-900 text-white text-[8px] px-4 py-2 border-2 border-red-500"><ShieldAlert size={12}/></button>
            </div>
          </div>
        ) : (
          <button onClick={() => setView('menu')} className="bg-geo-panel text-[10px] py-3 px-6 pixel-border text-center w-full shadow-2xl shadow-black">
            Wróć do Menu
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
