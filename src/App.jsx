import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Geolocation } from '@capacitor/geolocation';
import { toast, Toaster } from 'sonner';
import { 
  Compass, Coins, User, Shield, Ghost, 
  Map as MapIcon, Zap, MessageCircle, Settings 
} from 'lucide-react';

// TWOJE API KEY MAPBOX
mapboxgl.accessToken = 'Pk.eyJ1IjoiYWRvbmlzOTIiLCJhIjoiY21rNGkxZ3BtMDZoZTNlcjJ5dDhoaTdrbCJ9.Fk1LHVOLPIhapC6WZR4iBw';

const App = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [userPos, setUserPos] = useState(null);
  const [view, setView] = useState('map'); // 'map', 'profile', 'wallet'
  const [ghostMode, setGhostMode] = useState(false);
  const [balance, setBalance] = useState(1250);

  // Inicjalizacja Mapy
  useEffect(() => {
    if (map.current) return; 

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1', // Profesjonalny Dark Mode
      center: [19.2150, 50.0413], // Start w Oświęcimiu
      zoom: 15,
      pitch: 45, // Efekt 3D
      bearing: -17
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Pobieranie lokalizacji i aktualizacja pozycji gracza
    const watchId = Geolocation.watchPosition({ enableHighAccuracy: true }, (pos) => {
      if (pos) {
        const { latitude, longitude } = pos.coords;
        setUserPos([longitude, latitude]);
        
        if (map.current) {
          map.current.flyTo({ center: [longitude, latitude], speed: 0.8 });
          updateUserMarker(longitude, latitude);
        }
      }
    });

    return () => Geolocation.clearWatch({ id: watchId });
  }, []);

  const updateUserMarker = (lng, lat) => {
    // Tworzenie/Aktualizacja neonowego markera gracza
    const el = document.getElementById('user-marker') || document.createElement('div');
    el.id = 'user-marker';
    el.className = `w-8 h-8 rounded-full border-4 border-white shadow-[0_0_20px_#00f3ff] bg-[#00f3ff] transition-all duration-500 ${ghostMode ? 'opacity-30' : 'opacity-100'}`;
    
    new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(map.current);
  };

  return (
    <div className="h-screen w-screen bg-[#050505] flex flex-col overflow-hidden select-none">
      <Toaster position="top-center" richColors theme="dark" />

      {/* HUD GÓRNY */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-blue-600 border border-white/20 flex items-center justify-center shadow-lg shadow-blue-900/40">
            <User className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-[10px] font-black tracking-tighter text-blue-400 font-pixel">ADONIS_PRO</h2>
            <p className="text-[12px] font-bold">Level 12</p>
          </div>
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <div className="px-3 py-2 bg-black/60 border border-white/10 rounded-full flex items-center gap-2 backdrop-blur-md">
            <Coins className="text-yellow-400" size={16} />
            <span className="font-bold text-sm tracking-tight">{balance} GV</span>
          </div>
        </div>
      </div>

      {/* GŁÓWNY WIDOK MAPY */}
      <div ref={mapContainer} className="flex-1 w-full" />

      {/* INTERFEJS AKCJI (DOLNY PANEL) */}
      <div className="absolute bottom-8 left-4 right-4 z-50 flex flex-col gap-4 pointer-events-none">
        
        {/* Szybkie skróty nad barem */}
        <div className="flex justify-between items-end px-2">
          <button 
            onClick={() => setGhostMode(!ghostMode)}
            className={`p-4 rounded-2xl border backdrop-blur-xl transition-all pointer-events-auto ${ghostMode ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-black/40 border-white/10 text-white'}`}
          >
            {ghostMode ? <Ghost size={24} /> : <Shield size={24} />}
          </button>
          
          <button className="w-16 h-16 bg-blue-600 rounded-full border-4 border-white shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center justify-center text-white pointer-events-auto active:scale-90 transition-transform">
            <Zap size={32} fill="white" />
          </button>

          <button className="p-4 rounded-2xl bg-black/40 border border-white/10 text-white backdrop-blur-xl pointer-events-auto">
            <MessageCircle size={24} />
          </button>
        </div>

        {/* GŁÓWNA NAWIGACJA */}
        <nav className="h-16 bg-black/80 border border-white/10 rounded-3xl flex justify-around items-center backdrop-blur-2xl pointer-events-auto shadow-2xl">
          <button onClick={() => setView('map')} className={`flex flex-col items-center ${view === 'map' ? 'text-blue-400' : 'text-gray-500'}`}>
            <MapIcon size={22} />
            <span className="text-[9px] mt-1 font-bold tracking-widest uppercase">Eksploruj</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <Compass size={22} />
            <span className="text-[9px] mt-1 font-bold tracking-widest uppercase">Questy</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <Settings size={22} />
            <span className="text-[9px] mt-1 font-bold tracking-widest uppercase">Giełda</span>
          </button>
        </nav>
      </div>

      {/* Nakładka skanowania (Cyber Vibe) */}
      <div className="absolute inset-0 pointer-events-none border-[20px] border-blue-500/5 opacity-20 animate-pulse"></div>
    </div>
  );
};

export default App;
