import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import blazeNewLogo from "@/assets/blaze-new-logo.jpg";
import logoBranco from "@/assets/logo-branco.webp";
import logoBlazeCircular from "@/assets/logo-blaze-circular.jpg";
import HackerBackground from "@/components/HackerBackground";
import ResultsDisplay from "@/components/ResultsDisplay";

const SUPABASE_URL = 'https://chbuukoxnnohhojaedsm.supabase.co';
const POLL_MS = 50;

interface BlazeResult {
  id: string;
  color: number;
  roll: number;
  created_at: string;
}

const getBlazeColor = (roll: number): 'red' | 'black' | 'white' => {
  if (roll === 0) return 'white';
  if (roll >= 1 && roll <= 7) return 'red';
  return 'black';
};

const EstrategiaBranco = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [recentResults, setRecentResults] = useState<BlazeResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignal, setShowSignal] = useState(false);
  const [nextSignalTime, setNextSignalTime] = useState<string>("");
  const [assertiveness, setAssertiveness] = useState<number>(100);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem("hackerBlaze_user");
    if (!user) {
      navigate("/");
      return;
    }

    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes} 🌙`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/fetch-blaze-results`);
        if (!response.ok) throw new Error(`Edge function returned status ${response.status}`);
        const data = await response.json();
        let results: BlazeResult[] = Array.isArray(data) ? data : data.results || data.data || [];
        if (results.length > 0) setRecentResults(results.slice(0, 20));
        setIsLoading(false);
      } catch (error) {
        const mockData: BlazeResult[] = Array.from({ length: 20 }, (_, i) => ({
          id: `mock-${i}`,
          roll: Math.floor(Math.random() * 15),
          color: Math.floor(Math.random() * 3),
          created_at: new Date(Date.now() - i * 60000).toISOString()
        }));
        setRecentResults(mockData);
        setIsLoading(false);
      }
    };

    fetchResults();
    const interval = setInterval(fetchResults, POLL_MS);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateSignal = () => {
    const lastWhite = recentResults.find(result => getBlazeColor(result.roll) === 'white');
    if (lastWhite) {
      const whiteTime = new Date(lastWhite.created_at);
      whiteTime.setMinutes(whiteTime.getMinutes() + 13);
      const hours = String(whiteTime.getHours()).padStart(2, '0');
      const minutes = String(whiteTime.getMinutes()).padStart(2, '0');
      setNextSignalTime(`${hours}:${minutes}`);
      setAssertiveness(Math.floor(Math.random() * (98 - 89 + 1)) + 89);
      setShowSignal(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Poppins',sans-serif] relative overflow-hidden">
      <HackerBackground />
      
      <div className="relative z-10 max-w-full min-h-screen flex flex-col">
        {/* Top Bar */}
        <div className="h-14 flex items-center justify-between px-4 py-2 bg-[#2a2d3a]">
          <button onClick={() => navigate("/dashboard")} className="w-10 h-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="font-bold text-lg">Double</div>
          <button className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-400 rounded-full" />
          </button>
        </div>

        {/* Entry Status Section */}
        {showSignal && (
          <div className="mt-6 mx-4">
            {/* Main Card */}
            <div className="bg-[#3a3d4a]/90 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl">
              {/* Entrada Confirmada Header */}
              <h2 className="text-center text-xl font-bold text-white/90 mb-4">Entrada Confirmada</h2>

              {/* Logo Circular Central */}
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32">
                  <img 
                    src={logoBlazeCircular} 
                    alt="Blaze" 
                    className="w-full h-full rounded-full object-cover shadow-2xl ring-4 ring-red-500/30" 
                  />
                </div>
              </div>

              {/* Three Column Layout */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Horário - Left */}
                <div className="bg-[#2a2d3a]/60 rounded-2xl p-4 flex flex-col items-center justify-center">
                  <p className="text-xs text-white/60 font-medium mb-2">Horário</p>
                  <p className="text-3xl font-black text-white tabular-nums">{nextSignalTime}</p>
                </div>

                {/* Logo Center - Larger */}
                <div className="bg-white rounded-2xl p-4 flex items-center justify-center">
                  <img src={logoBranco} alt="Branco" className="w-20 h-20 object-contain" />
                </div>

                {/* Entrada - Right */}
                <div className="bg-[#2a2d3a]/60 rounded-2xl p-4 flex flex-col items-center justify-center">
                  <p className="text-xs text-white/60 font-medium mb-2">Entrada</p>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <img src={logoBranco} alt="Entrada" className="w-10 h-10 object-contain" />
                  </div>
                </div>
              </div>

              {/* Pessoas Fizeram Entrada */}
              <p className="text-center text-base text-white/80 font-medium">
                <span className="text-white font-bold">3</span> Pessoas Fizeram Entrada!
              </p>
            </div>
          </div>
        )}

        {!showSignal && (
          <div className="mt-4 mx-4 p-6 bg-[#2a2d3a] rounded-2xl">
            <h2 className="text-center text-2xl font-bold text-gray-300 mb-3">
              Aguardando
            </h2>
            <p className="text-center text-gray-400 text-sm">
              <span className="text-white font-bold">0</span> Pessoas Fizeram Entrada!
            </p>
          </div>
        )}

        {/* Center Signal Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          {showSignal ? (
            <div className="space-y-6 w-full max-w-sm">
              {/* Assertiveness */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Assertividade {assertiveness}%</h3>
                <p className="text-sm text-gray-400">Não precisa fazer Gale</p>
              </div>

              <button 
                onClick={() => setShowSignal(false)} 
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Fechar Sinal
              </button>
            </div>
          ) : (
            <div className="space-y-8 w-full max-w-sm">
              {/* Blaze Icon with animation */}
              <div className="flex justify-center">
                <div className="relative w-40 h-40">
                  {/* Rotating border */}
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 border-r-red-500 animate-spin" 
                       style={{ animationDuration: '3s' }}
                  />
                  {/* Inner circle */}
                  <div className="absolute inset-2 rounded-full bg-[#2a2d3a] flex items-center justify-center">
                    <img src={blazeNewLogo} alt="Blaze" className="w-20 h-20 rounded-lg object-cover" />
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button 
                onClick={handleGenerateSignal} 
                disabled={recentResults.length === 0}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="bg-black border-2 border-red-600 rounded-xl py-4 px-6 flex items-center justify-center gap-3 hover:bg-red-900/20 transition-all">
                  <span className="text-red-600 text-2xl font-bold">⏬</span>
                  <span className="text-white font-bold text-lg uppercase tracking-wider">Gerar Sinal</span>
                  <span className="text-red-600 text-2xl font-bold">⏬</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="mx-4 mb-20 flex items-center justify-center">
          <ResultsDisplay />
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#1a1d28] flex items-center justify-around px-6 border-t border-gray-800">
          <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <div className="text-2xl">🏠</div>
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <div className="text-2xl">🏛️</div>
            <span className="text-xs">Deposit</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <div className="text-2xl">💰</div>
            <span className="text-xs">Windraw</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstrategiaBranco;
