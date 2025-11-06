import { useNavigate } from "react-router-dom";
import HackerBackground from "@/components/HackerBackground";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-black relative overflow-hidden">
      <HackerBackground />
      <div className="text-center relative z-10">
        <h1 className="mb-4 text-4xl font-bold text-white">Freitas White</h1>
        <p className="text-xl text-white/70 mb-8">Sistema de Estratégias</p>
        <button 
          onClick={() => navigate("/login")}
          className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg"
        >
          Acessar Sistema
        </button>
      </div>
    </div>
  );
};

export default Index;
