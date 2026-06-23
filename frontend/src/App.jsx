import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import CadastroFuncionario from './pages/CadastroFuncionario';
import CadastroCliente from './pages/CadastroCliente';
import GestaoCardapio from './pages/GestaoCardapio';
import PedidosManuais from './pages/PedidosManuais';
import Marketplace from './pages/Marketplace';
import Treinamentos from './pages/Treinamentos';
import Financeiro from './pages/Financeiro';
import Fornecedores from './pages/Fornecedores';
import CotacaoFornecedores from './pages/CotacaoFornecedores';
import ChatBot from './pages/ChatBot';
import ConsultasCredito from './pages/ConsultasCredito';
import PlaceholderPage from './pages/PlaceholderPage';
import GestaoAcesso from './pages/GestaoAcesso';
import GestãoChamados from './pages/GestãoChamados';
import Supervisores from './pages/Supervisores';
import Clientes from './pages/Clientes';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { fontWeight: 600, fontSize: '0.9rem' } }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/master" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="supervisores" element={<Supervisores />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="funcionarios/novo" element={<CadastroFuncionario />} />
          <Route path="clientes/novo" element={<CadastroCliente />} />
          <Route path="cardapio" element={<GestaoCardapio />} />
          <Route path="pedidos" element={<PedidosManuais />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="treinamentos" element={<Treinamentos />} />
          <Route path="financeiro" element={<Financeiro />} />
          <Route path="fornecedores" element={<Fornecedores />} />
          <Route path="cotacao" element={<CotacaoFornecedores />} />
          <Route path="chatbot" element={<ChatBot />} />
          <Route path="consultas-credito" element={<ConsultasCredito />} />
          <Route path="chamados" element={<GestãoChamados />} />
          <Route path="acesso" element={<GestaoAcesso />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
