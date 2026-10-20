import Header from '../header/Header';

// Moldura das telas do marketplace: cenário de fundo + Header no topo + conteúdo.
// O cenário (.scene) está no index.css, por isso não tem MainLayout.css.
function MainLayout({ loggedIn, logout, children }) {
  return (
    <div className="scene">
      <Header loggedIn={loggedIn} logout={logout} />
      {children}
    </div>
  );
}

export default MainLayout;
