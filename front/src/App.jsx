import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/scrollToTop/ScrollToTop';
import PaginaInicial from './pages/paginaInicial/PaginaInicial';
import PaginaDetalhesOferta from './pages/paginaDetalhesOferta/PaginaDetalhesOferta';
import PaginaMinhaConta from './pages/paginaMinhaConta/PaginaMinhaConta';
import PaginaLogin from './pages/paginaLogin/PaginaLogin';
import PaginaCadastro from './pages/paginaCadastro/PaginaCadastro';
import PaginaRecuperarSenha from './pages/paginaRecuperarSenha/PaginaRecuperarSenha';
import PaginaValidarCodigo from './pages/paginaValidarCodigo/PaginaValidarCodigo';
import PaginaNovaSenha from './pages/paginaNovaSenha/PaginaNovaSenha';
import PaginaSenhaAlterada from './pages/paginaSenhaAlterada/PaginaSenhaAlterada';

// Guarda o login no navegador para ele não sumir ao apertar F5.
// (Login de demonstração; trocar pela sessão do backend quando existir.)
const LOGIN_KEY = 'gameduo:logado';

function lerLogin() {
  try {
    return localStorage.getItem(LOGIN_KEY) === 'sim';
  } catch {
    return false;
  }
}

function salvarLogin(logado) {
  try {
    if (logado) localStorage.setItem(LOGIN_KEY, 'sim');
    else localStorage.removeItem(LOGIN_KEY);
  } catch {
    // Navegador bloqueou o armazenamento: o login só dura até o F5.
  }
}

function App() {
  const [loggedIn, setLoggedIn] = useState(lerLogin);

  const login = () => {
    salvarLogin(true);
    setLoggedIn(true);
  };

  const logout = () => {
    salvarLogin(false);
    setLoggedIn(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Catálogo e conta */}
        <Route path="/" element={<PaginaInicial loggedIn={loggedIn} logout={logout} />} />
        <Route path="/oferta/:id" element={<PaginaDetalhesOferta loggedIn={loggedIn} logout={logout} />} />
        <Route
          path="/minha-conta"
          element={loggedIn ? <PaginaMinhaConta logout={logout} /> : <Navigate to="/login" replace />}
        />

        {/* Autenticação */}
        <Route path="/login" element={<PaginaLogin onLogin={login} />} />
        <Route path="/cadastro" element={<PaginaCadastro />} />
        <Route path="/recuperar-senha" element={<PaginaRecuperarSenha />} />
        <Route path="/validar-codigo" element={<PaginaValidarCodigo />} />
        <Route path="/nova-senha" element={<PaginaNovaSenha />} />
        <Route path="/senha-alterada" element={<PaginaSenhaAlterada />} />

        {/* Qualquer endereço desconhecido volta para o catálogo */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
