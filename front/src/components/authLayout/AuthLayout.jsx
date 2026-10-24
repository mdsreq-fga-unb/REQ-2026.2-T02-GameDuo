import './AuthLayout.css';

// Moldura das telas de login, cadastro e recuperação de senha:
// cenário de fundo com o conteúdo centralizado.
function AuthLayout({ children }) {
  return (
    <main className="auth-layout scene">
      {children}
    </main>
  );
}

export default AuthLayout;
