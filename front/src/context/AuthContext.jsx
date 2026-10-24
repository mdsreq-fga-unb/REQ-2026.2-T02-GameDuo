import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, lerToken, salvarToken } from '../services/api';

// Guarda quem está logado e oferece entrar / sair para qualquer tela.
// usuario: { email, nome, nickname, prestador } ou null (visitante).
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  // true enquanto confere, ao abrir o site, se o token salvo ainda vale
  const [carregando, setCarregando] = useState(() => Boolean(lerToken()));

  // Busca os dados atualizados do usuário logado (ex.: depois de virar prestador).
  const atualizarUsuario = useCallback(async () => {
    try {
      const data = await api("/me");
      setUsuario(data.usuario);
    } catch {
      // Token vencido ou inválido: volta a ser visitante.
      salvarToken(null);
      setUsuario(null);
    }
  }, []);

  useEffect(() => {
    if (lerToken()) atualizarUsuario().finally(() => setCarregando(false));
  }, [atualizarUsuario]);

  const entrar = async (email, senha) => {
    const data = await api("/login", { method: "POST", body: { email, senha } });
    salvarToken(data.token);
    setUsuario(data.usuario);
  };

  const sair = async () => {
    try {
      await api("/logout", { method: "POST" });
    } catch {
      // Mesmo se o servidor falhar, o token é apagado do navegador.
    }
    salvarToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, loggedIn: Boolean(usuario), carregando, entrar, sair, atualizarUsuario, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
