import { useState } from "react";
import { PaginaMinhaConta } from "@/features/account";
import {
  PaginaCadastro,
  PaginaLogin,
  PaginaNovaSenha,
  PaginaRecuperarSenha,
  PaginaSenhaAlterada,
  PaginaValidarCodigo,
} from "@/features/auth";
import { PaginaInicial } from "@/features/catalog";
import { PaginaDetalhesOferta } from "@/features/offer-details";
import { offers } from "@/mocks/offers";
import { PAGINA_INICIAL, type Offer, type Pagina } from "@/types";

export default function App() {
  const [pagina, setPagina] = useState<Pagina>(PAGINA_INICIAL);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer>(offers[0]);
  const [loginSuccess, setLoginSuccess] = useState("");

  const navigate = (proxima: Pagina) => {
    setPagina(proxima);
    window.scrollTo(0, 0);
  };

  const login = () => {
    setLoggedIn(true);
    setLoginSuccess("");
    navigate(PAGINA_INICIAL);
  };

  const logout = () => {
    setLoggedIn(false);
    navigate(PAGINA_INICIAL);
  };

  const handleRegistered = () => {
    setLoginSuccess("Conta criada com sucesso!");
    navigate("login");
  };

  const openOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    navigate("detalhes-oferta");
  };

  switch (pagina) {
    // Página principal: catálogo de ofertas
    case "inicio":
      return <PaginaInicial loggedIn={loggedIn} navigate={navigate} logout={logout} onSelectOffer={openOffer} />;

    case "detalhes-oferta":
      return <PaginaDetalhesOferta offer={selectedOffer} loggedIn={loggedIn} navigate={navigate} />;
    case "minha-conta":
      return <PaginaMinhaConta navigate={navigate} logout={logout} />;

    // Autenticação
    case "login":
      return <PaginaLogin navigate={navigate} success={loginSuccess} onLogin={login} />;
    case "cadastro":
      return <PaginaCadastro navigate={navigate} onSuccess={handleRegistered} />;
    case "recuperar-senha":
      return <PaginaRecuperarSenha navigate={navigate} />;
    case "validar-codigo":
      return <PaginaValidarCodigo navigate={navigate} />;
    case "nova-senha":
      return <PaginaNovaSenha navigate={navigate} />;
    case "senha-alterada":
      return <PaginaSenhaAlterada navigate={navigate} />;
  }
}
