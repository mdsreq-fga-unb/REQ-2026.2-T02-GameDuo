import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/scrollToTop/ScrollToTop';
import PaginaInicial from './pages/paginaInicial/PaginaInicial';
import PaginaDetalhesOferta from './pages/paginaDetalhesOferta/PaginaDetalhesOferta';
import PaginaMinhaConta from './pages/paginaMinhaConta/PaginaMinhaConta';
import PaginaMinhasOfertas from './pages/paginaMinhasOfertas/PaginaMinhasOfertas';
import PaginaLogin from './pages/paginaLogin/PaginaLogin';
import PaginaCadastro from './pages/paginaCadastro/PaginaCadastro';
import PaginaRecuperarSenha from './pages/paginaRecuperarSenha/PaginaRecuperarSenha';
import PaginaValidarCodigo from './pages/paginaValidarCodigo/PaginaValidarCodigo';
import PaginaNovaSenha from './pages/paginaNovaSenha/PaginaNovaSenha';
import PaginaSenhaAlterada from './pages/paginaSenhaAlterada/PaginaSenhaAlterada';

// Só deixa entrar quem está logado (e, com soPrestador, quem tem perfil de prestador).
function RotaPrivada({ children, soPrestador = false }) {
  const { usuario, carregando } = useAuth();
  const location = useLocation();

  // Ainda conferindo o token salvo: espera antes de decidir.
  if (carregando) return null;
  if (!usuario) return <Navigate to="/login" replace state={{ voltarPara: location.pathname }} />;
  if (soPrestador && !usuario.prestador) return <Navigate to="/minha-conta" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Catálogo e conta */}
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/oferta/:id" element={<PaginaDetalhesOferta />} />
          <Route path="/minha-conta" element={<RotaPrivada><PaginaMinhaConta /></RotaPrivada>} />
          <Route path="/minhas-ofertas" element={<RotaPrivada soPrestador><PaginaMinhasOfertas /></RotaPrivada>} />

          {/* Autenticação */}
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/cadastro" element={<PaginaCadastro />} />
          <Route path="/recuperar-senha" element={<PaginaRecuperarSenha />} />
          <Route path="/validar-codigo" element={<PaginaValidarCodigo />} />
          <Route path="/nova-senha" element={<PaginaNovaSenha />} />
          <Route path="/senha-alterada" element={<PaginaSenhaAlterada />} />

          {/* Qualquer endereço desconhecido volta para o catálogo */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
