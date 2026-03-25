import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import Mapa from "./pages/Mapa.tsx";
import Alertas from "./pages/Alertas.tsx";
import Ocupacao from "./pages/Ocupacao.tsx";
import Monitoramento from "./pages/Monitoramento.tsx";
import Vaquinha from "./pages/Vaquinha.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/alertas" element={<Alertas />} />
            <Route path="/ocupacao" element={<Ocupacao />} />
            <Route path="/monitoramento" element={<Monitoramento />} />
            <Route path="/vaquinha" element={<Vaquinha />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
