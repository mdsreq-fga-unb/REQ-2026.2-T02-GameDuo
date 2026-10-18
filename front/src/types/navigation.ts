export type Pagina =
  | "inicio"
  | "login"
  | "cadastro"
  | "recuperar-senha"
  | "validar-codigo"
  | "nova-senha"
  | "senha-alterada"
  | "detalhes-oferta"
  | "minha-conta";

/** Página principal do GameDuo: o catálogo de ofertas. É a primeira tela exibida. */
export const PAGINA_INICIAL: Pagina = "inicio";

export type Navigate = (pagina: Pagina) => void;
