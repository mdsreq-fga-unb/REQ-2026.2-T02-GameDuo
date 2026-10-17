import { FormEvent, ReactNode, useMemo, useState } from "react";

type Screen =
  | "catalog"
  | "login"
  | "register"
  | "recover"
  | "code"
  | "new-password"
  | "password-changed"
  | "details"
  | "account";
type Modality = "Coaching" | "Duo";
type MessageKind = "success" | "error" | "info";

type Offer = {
  id: number;
  title: string;
  nickname: string;
  game: string;
  modality: Modality;
  duration: string;
  price: number;
  avatar: string;
  accent: string;
  level: string;
};

const offers: Offer[] = [
  { id: 1, title: "Suba de elo sem tilt", nickname: "NinjaNina", game: "Arena Lendária", modality: "Coaching", duration: "60 min", price: 120, avatar: "NN", accent: "pink", level: "Mestre" },
  { id: 2, title: "Duo ranqueado estratégico", nickname: "CapitãoBit", game: "Arena Lendária", modality: "Duo", duration: "90 min", price: 85, avatar: "CB", accent: "blue", level: "Diamante" },
  { id: 3, title: "Mira e posicionamento", nickname: "PixelFox", game: "Operação Neon", modality: "Coaching", duration: "45 min", price: 70, avatar: "PF", accent: "orange", level: "Elite" },
  { id: 4, title: "Exploração sem pressa", nickname: "LuaArcade", game: "Reinos & Runas", modality: "Duo", duration: "120 min", price: 95, avatar: "LA", accent: "purple", level: "Veterano" },
  { id: 5, title: "Rotação e leitura de mapa", nickname: "TurboTheo", game: "Batalha Estelar", modality: "Coaching", duration: "60 min", price: 150, avatar: "TT", accent: "green", level: "Campeão" },
  { id: 6, title: "Missões e resenha", nickname: "MagoMika", game: "Reinos & Runas", modality: "Duo", duration: "60 min", price: 55, avatar: "MM", accent: "yellow", level: "Ouro" },
];

const games = ["Todos", ...Array.from(new Set(offers.map((offer) => offer.game)))];

function PixelIcon({ type }: { type: "controller" | "coin" | "eye" | "eye-off" | "hourglass" | "trophy" | "people" | "shield" | "heart" }) {
  const symbols = {
    controller: "◆",
    coin: "●",
    eye: "◉",
    "eye-off": "⊘",
    hourglass: "⌛",
    trophy: "♛",
    people: "♟♟",
    shield: "◆",
    heart: "♥",
  };
  return <span className={`pixel-icon pixel-icon--${type}`} aria-hidden="true">{symbols[type]}</span>;
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <button className={`logo ${compact ? "logo--compact" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="GameDuo, início">
      <span className="logo-mark"><i /><i /></span>
      <span>Game<span>Duo</span></span>
    </button>
  );
}

function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "link" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return <button className={`btn btn--${variant} ${className}`} onClick={onClick} type={type} disabled={disabled}>{children}</button>;
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  help,
  reveal,
  onReveal,
  name,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  error?: string;
  help?: string;
  reveal?: boolean;
  onReveal?: () => void;
  name?: string;
  autoComplete?: string;
}) {
  return (
    <label className={`field ${error ? "field--error" : ""}`}>
      <span className="field__label">{label}</span>
      <span className="field__control">
        <input
          name={name}
          type={type === "password" && reveal ? "text" : type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
        />
        {type === "password" && (
          <button type="button" className="eye-button" onClick={onReveal} aria-label={reveal ? "Ocultar senha" : "Mostrar senha"}>
            <PixelIcon type={reveal ? "eye-off" : "eye"} />
          </button>
        )}
      </span>
      {help && !error && <span className="field__help">{help}</span>}
      {error && <span className="field__error"><PixelIcon type="heart" /> {error}</span>}
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="field field--select">
      <span className="field__label">{label}</span>
      <span className="field__control">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
      </span>
    </label>
  );
}

function Message({ kind, children }: { kind: MessageKind; children: ReactNode }) {
  return (
    <div className={`message message--${kind}`} role={kind === "error" ? "alert" : "status"}>
      <span className="message__portrait">{kind === "success" ? "✓" : kind === "error" ? "!" : "i"}</span>
      <span>{children}</span>
      <i className="message__next">▼</i>
    </div>
  );
}

function DialogPanel({ children, size = "normal" }: { children: ReactNode; size?: "normal" | "wide" }) {
  return <section className={`dialog-panel dialog-panel--${size}`}>{children}</section>;
}

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-layout scene">
      <div className="stars stars--one" />
      <div className="stars stars--two" />
      {children}
    </main>
  );
}

function AuthHeading({ title, subtitle, showLogo = true }: { title: string; subtitle?: string; showLogo?: boolean }) {
  return (
    <header className="auth-heading">
      {showLogo && <Logo />}
      <p className="eyebrow">PLAYER SELECT</p>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}

function Header({ loggedIn, navigate, logout }: { loggedIn: boolean; navigate: (screen: Screen) => void; logout: () => void }) {
  return (
    <header className="hud">
      <Logo compact />
      <nav aria-label="Navegação principal">
        {loggedIn ? (
          <>
            <button className="player-chip" onClick={() => navigate("account")}>
              <span className="avatar avatar--small">FL</span>
              <span><b>Fulano</b><small><PixelIcon type="coin" /> 480 créditos</small></span>
            </button>
            <Button variant="ghost" onClick={() => navigate("account")}>Minha conta</Button>
            <Button variant="link" onClick={logout}>Sair</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => navigate("login")}>Entrar</Button>
            <Button onClick={() => navigate("register")}>Criar conta</Button>
          </>
        )}
      </nav>
    </header>
  );
}

function ModalityTabs({ value, onChange }: { value: Modality | ""; onChange: (value: Modality) => void }) {
  return (
    <div className="tabs" role="tablist" aria-label="Modalidade">
      <button className={value === "Coaching" ? "active" : ""} onClick={() => onChange("Coaching")} role="tab" aria-selected={value === "Coaching"}>
        <PixelIcon type="shield" /><span>Coaching</span>
      </button>
      <button className={value === "Duo" ? "active" : ""} onClick={() => onChange("Duo")} role="tab" aria-selected={value === "Duo"}>
        <PixelIcon type="people" /><span>Duos</span>
      </button>
    </div>
  );
}

function OfferCard({ offer, onDetails }: { offer: Offer; onDetails: () => void }) {
  return (
    <article className="offer-card">
      <div className="offer-card__top">
        <span className={`avatar avatar--${offer.accent}`}>{offer.avatar}</span>
        <div><p className="offer-card__level">{offer.level}</p><p className="offer-card__nick">@{offer.nickname}</p></div>
        <span className="online-dot">ON</span>
      </div>
      <h3>{offer.title}</h3>
      <div className="tag-row"><span>{offer.game}</span><span>{offer.modality}</span></div>
      <div className="offer-card__meta">
        <span>{offer.duration}</span>
        <strong><PixelIcon type="coin" /> {offer.price}</strong>
      </div>
      <Button onClick={onDetails}>Ver detalhes <span aria-hidden="true">►</span></Button>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-art" aria-hidden="true"><span>?</span><i /><b>⌕</b></div>
      <h3>Nenhuma oferta encontrada</h3>
      <p>Nenhuma oferta encontrada para os filtros selecionados.</p>
    </div>
  );
}

function Catalog({
  loggedIn,
  navigate,
  logout,
  onSelectOffer,
}: {
  loggedIn: boolean;
  navigate: (screen: Screen) => void;
  logout: () => void;
  onSelectOffer: (offer: Offer) => void;
}) {
  const [modality, setModality] = useState<Modality | "">("");
  const [game, setGame] = useState("Todos");
  const [price, setPrice] = useState("Todos");
  const [applied, setApplied] = useState({ modality: "" as Modality | "", game: "Todos", price: "Todos" });
  const filtered = useMemo(() => offers.filter((offer) => {
    const modalityMatch = !applied.modality || offer.modality === applied.modality;
    const gameMatch = applied.game === "Todos" || offer.game === applied.game;
    const priceMatch = applied.price === "Todos"
      || (applied.price === "Até 75" && offer.price <= 75)
      || (applied.price === "76 a 100" && offer.price >= 76 && offer.price <= 100)
      || (applied.price === "Acima de 100" && offer.price > 100);
    return modalityMatch && gameMatch && priceMatch;
  }), [applied]);

  const clearFilters = () => {
    setModality("");
    setGame("Todos");
    setPrice("Todos");
    setApplied({ modality: "", game: "Todos", price: "Todos" });
  };

  return (
    <div className="catalog-page scene">
      <Header loggedIn={loggedIn} navigate={navigate} logout={logout} />
      <main className="catalog-main">
        <section className="catalog-hero">
          <div>
            <p className="eyebrow">FASE 01 · ESCOLHA SUA MISSÃO</p>
            <h1>Jogue melhor.<br /><span>Nunca jogue só.</span></h1>
            <p>Encontre quem entende do seu jogo, do seu nível e do seu objetivo.</p>
          </div>
          <div className="hero-party" aria-hidden="true">
            <span className="hero-speech">READY?</span>
            <i className="hero-char hero-char--one" />
            <i className="hero-char hero-char--two" />
          </div>
        </section>

        <section className="filter-panel" aria-label="Filtros de ofertas">
          <div className="filter-panel__head"><span>BUSCAR PARTIDA</span><small>{filtered.length} ofertas encontradas</small></div>
          <div className="filters">
            <ModalityTabs value={modality} onChange={setModality} />
            <Select label="Jogo" value={game} options={games} onChange={setGame} />
            <Select label="Preço em créditos" value={price} options={["Todos", "Até 75", "76 a 100", "Acima de 100"]} onChange={setPrice} />
            <div className="filter-actions">
              <Button onClick={() => setApplied({ modality, game, price })}>Aplicar filtros</Button>
              <Button variant="secondary" onClick={clearFilters}>Limpar</Button>
            </div>
          </div>
        </section>

        <section className="offers-section">
          <div className="section-heading">
            <div><p className="eyebrow">PARTY FINDER</p><h2>Ofertas em destaque</h2></div>
            <span className="section-heading__line" />
            <span className="result-count">{filtered.length.toString().padStart(2, "0")}</span>
          </div>
          {filtered.length ? (
            <div className="offer-grid">
              {filtered.map((offer) => <OfferCard key={offer.id} offer={offer} onDetails={() => onSelectOffer(offer)} />)}
            </div>
          ) : <EmptyState />}
        </section>
      </main>
      <footer><Logo compact /><span>Feito para quem leva a diversão a sério.</span><span>© 2025 GameDuo</span></footer>
    </div>
  );
}

function Login({ navigate, onLogin, success }: { navigate: (screen: Screen) => void; onLogin: () => void; success: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (email === "gamer@gameduo.com" && password === "player1") onLogin();
    else setError("E-mail ou senha incorretos. Confira os dados e tente novamente.");
  };
  return (
    <AuthLayout>
      <DialogPanel>
        <AuthHeading title="Entre na sua conta" subtitle="Encontre sua próxima dupla." />
        {success && <Message kind="success">{success}</Message>}
        {error && <Message kind="error">{error}</Message>}
        <form onSubmit={submit}>
          <Input label="E-mail" value={email} onChange={setEmail} placeholder="Digite seu e-mail" type="email" autoComplete="email" />
          <Input label="Senha" value={password} onChange={setPassword} placeholder="Digite sua senha" type="password" reveal={reveal} onReveal={() => setReveal(!reveal)} autoComplete="current-password" />
          <p className="demo-hint">ACESSO DEMO: gamer@gameduo.com / player1</p>
          <Button type="submit" className="btn--full">Entrar</Button>
        </form>
        <div className="auth-links">
          <p>Não tem uma conta? <Button variant="link" onClick={() => navigate("register")}>Criar conta</Button></p>
          <p>Esqueceu sua senha? <Button variant="link" onClick={() => navigate("recover")}>Recuperar senha</Button></p>
        </div>
      </DialogPanel>
      <Button variant="ghost" className="back-floating" onClick={() => navigate("catalog")}>← Voltar ao catálogo</Button>
    </AuthLayout>
  );
}

function Register({ navigate, onSuccess }: { navigate: (screen: Screen) => void; onSuccess: () => void }) {
  const [data, setData] = useState({ nickname: "", email: "", phone: "", password: "", confirm: "" });
  const [reveal, setReveal] = useState({ password: false, confirm: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const update = (key: keyof typeof data) => (value: string) => setData({ ...data, [key]: value });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (data.nickname.trim().length < 3) next.nickname = "Use pelo menos 3 caracteres.";
    if (!/^\S+@\S+\.\S+$/.test(data.email)) next.email = "Informe um e-mail válido.";
    if (data.phone.replace(/\D/g, "").length < 10) next.phone = "Informe telefone e DDD.";
    if (data.password.length < 8) next.password = "A senha precisa ter 8 caracteres.";
    if (data.confirm !== data.password) next.confirm = "As senhas não coincidem.";
    setErrors(next);
    if (!Object.keys(next).length) onSuccess();
  };
  return (
    <AuthLayout>
      <DialogPanel size="wide">
        <AuthHeading title="Criar conta" subtitle="Encontre coaching e duo ou ofereça seus serviços." />
        <form onSubmit={submit} className="form-grid">
          <div className="form-grid__full"><Input label="Nickname" value={data.nickname} onChange={update("nickname")} placeholder="Nickname/Apelido" help="Este será seu nome público no GameDuo." error={errors.nickname} /></div>
          <Input label="E-mail" value={data.email} onChange={update("email")} placeholder="Digite seu e-mail" type="email" error={errors.email} />
          <Input label="Telefone" value={data.phone} onChange={update("phone")} placeholder="Informe seu telefone com DDD" type="tel" error={errors.phone} />
          <Input label="Senha" value={data.password} onChange={update("password")} placeholder="Crie sua senha" type="password" reveal={reveal.password} onReveal={() => setReveal({ ...reveal, password: !reveal.password })} error={errors.password} />
          <Input label="Confirmar senha" value={data.confirm} onChange={update("confirm")} placeholder="Repita sua senha" type="password" reveal={reveal.confirm} onReveal={() => setReveal({ ...reveal, confirm: !reveal.confirm })} error={errors.confirm} />
          <div className="form-grid__full"><Button type="submit" className="btn--full">Criar conta</Button></div>
        </form>
        <div className="auth-links"><p>Já tem uma conta? <Button variant="link" onClick={() => navigate("login")}>Entrar</Button></p></div>
      </DialogPanel>
    </AuthLayout>
  );
}

function Recover({ navigate }: { navigate: (screen: Screen) => void }) {
  const [channel, setChannel] = useState<"email" | "phone">("email");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const valid = channel === "email" ? /^\S+@\S+\.\S+$/.test(value) : value.replace(/\D/g, "").length >= 10;
    if (valid) navigate("code");
    else setError(channel === "email" ? "Informe um e-mail válido." : "Informe telefone e DDD.");
  };
  return (
    <AuthLayout>
      <DialogPanel>
        <AuthHeading title="Recuperar senha" />
        <p className="intro-copy">Escolha como deseja receber o código.</p>
        <div className="rpg-options" role="radiogroup" aria-label="Canal de recuperação">
          <button role="radio" aria-checked={channel === "email"} className={channel === "email" ? "active" : ""} onClick={() => { setChannel("email"); setValue(""); setError(""); }}><i>►</i><span>E-mail</span><b /></button>
          <button role="radio" aria-checked={channel === "phone"} className={channel === "phone" ? "active" : ""} onClick={() => { setChannel("phone"); setValue(""); setError(""); }}><i>►</i><span>Telefone</span><b /></button>
        </div>
        <form onSubmit={submit}>
          <Input label={channel === "email" ? "E-mail cadastrado" : "Telefone cadastrado"} value={value} onChange={setValue} placeholder={channel === "email" ? "Digite seu e-mail" : "Informe seu telefone com DDD"} type={channel === "email" ? "email" : "tel"} error={error} />
          <Button type="submit" className="btn--full">Enviar código</Button>
        </form>
        <div className="auth-links"><Button variant="link" onClick={() => navigate("login")}>← Voltar para o login</Button></div>
      </DialogPanel>
    </AuthLayout>
  );
}

function CodeValidation({ navigate }: { navigate: (screen: Screen) => void }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ kind: MessageKind; text: string } | null>(null);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (code === "123456") navigate("new-password");
    else setMessage({ kind: "error", text: "Código inválido, expirado ou já utilizado. Tente novamente." });
  };
  return (
    <AuthLayout>
      <DialogPanel>
        <AuthHeading title="Verifique sua solicitação" showLogo={false} />
        <p className="intro-copy">Se os dados corresponderem a uma conta, você receberá um código pelo canal escolhido.</p>
        {message && <Message kind={message.kind}>{message.text}</Message>}
        <form onSubmit={submit}>
          <label className="field">
            <span className="field__label">Código</span>
            <input className="code-input" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="• • • • • •" inputMode="numeric" aria-label="Digite o código recebido" />
            <span className="field__help"><PixelIcon type="hourglass" /> O código é de uso único e expira em 30 minutos.</span>
          </label>
          <p className="demo-hint">CÓDIGO DEMO: 123456</p>
          <Button type="submit" className="btn--full">Validar código</Button>
        </form>
        <div className="auth-links auth-links--stack">
          <Button variant="link" onClick={() => setMessage({ kind: "success", text: "Se os dados estiverem corretos, um novo código foi enviado." })}>Solicitar novo código</Button>
          <Button variant="link" onClick={() => navigate("recover")}>Corrigir e-mail ou telefone</Button>
          <Button variant="link" onClick={() => navigate("login")}>Voltar para o login</Button>
        </div>
      </DialogPanel>
    </AuthLayout>
  );
}

const passwordRules = [
  { label: "Pelo menos 8 caracteres", test: (value: string) => value.length >= 8 },
  { label: "Uma letra maiúscula", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Um número", test: (value: string) => /\d/.test(value) },
  { label: "Um símbolo especial", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

function NewPassword({ navigate }: { navigate: (screen: Screen) => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [reveal, setReveal] = useState({ password: false, confirm: false });
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!passwordRules.every((rule) => rule.test(password))) setError("Complete todas as regras da missão.");
    else if (password !== confirm) setError("As senhas não coincidem.");
    else navigate("password-changed");
  };
  return (
    <AuthLayout>
      <DialogPanel>
        <AuthHeading title="Definir nova senha" showLogo={false} />
        {error && <Message kind="error">{error}</Message>}
        <form onSubmit={submit}>
          <Input label="Nova senha" value={password} onChange={setPassword} placeholder="Digite sua nova senha" type="password" reveal={reveal.password} onReveal={() => setReveal({ ...reveal, password: !reveal.password })} />
          <Input label="Confirmar nova senha" value={confirm} onChange={setConfirm} placeholder="Repita sua nova senha" type="password" reveal={reveal.confirm} onReveal={() => setReveal({ ...reveal, confirm: !reveal.confirm })} />
          <div className="quest-list">
            <p>MISSÃO: SENHA FORTE</p>
            {passwordRules.map((rule) => {
              const done = rule.test(password);
              return <span className={done ? "done" : ""} key={rule.label}><i>{done ? "✓" : "□"}</i>{rule.label}</span>;
            })}
          </div>
          <Button type="submit" className="btn--full">Salvar senha</Button>
        </form>
      </DialogPanel>
    </AuthLayout>
  );
}

function PasswordChanged({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <AuthLayout>
      <DialogPanel>
        <div className="stage-clear">
          <p className="eyebrow">LEVEL UP!</p>
          <div className="trophy"><PixelIcon type="trophy" /></div>
          <h1>Stage clear!</h1>
          <Message kind="success">Senha alterada com sucesso.</Message>
          <p>Sua conta está protegida. Use a nova senha no próximo acesso.</p>
          <Button className="btn--full" onClick={() => navigate("login")}>Voltar ao login</Button>
        </div>
      </DialogPanel>
    </AuthLayout>
  );
}

function OfferDetails({ offer, loggedIn, navigate }: { offer: Offer; loggedIn: boolean; navigate: (screen: Screen) => void }) {
  return (
    <div className="catalog-page scene">
      <Header loggedIn={loggedIn} navigate={navigate} logout={() => navigate("catalog")} />
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate("catalog")}>← Voltar às ofertas</Button>
        <div className="detail-grid">
          <DialogPanel>
            <div className="detail-profile">
              <span className={`avatar avatar--large avatar--${offer.accent}`}>{offer.avatar}</span>
              <p className="eyebrow">{offer.level}</p>
              <h1>{offer.title}</h1>
              <p>com <strong>@{offer.nickname}</strong></p>
              <div className="tag-row"><span>{offer.game}</span><span>{offer.modality}</span></div>
            </div>
          </DialogPanel>
          <DialogPanel>
            <p className="eyebrow">DETALHES DA MISSÃO</p>
            <h2>Prepare sua partida</h2>
            <p className="detail-copy">Uma sessão personalizada para evoluir, completar objetivos e se divertir com companhia de alto nível.</p>
            <ul className="perk-list"><li>✓ Comunicação por voz</li><li>✓ Horário combinado</li><li>✓ Sessão de {offer.duration}</li></ul>
            <div className="detail-price"><span>Total</span><strong><PixelIcon type="coin" /> {offer.price} créditos</strong></div>
            {loggedIn ? <Button className="btn--full" onClick={() => alert("Solicitação enviada! O prestador entrará em contato.")}>Contratar agora</Button> : (
              <>
                <Message kind="info">Entre na sua conta para contratar esta oferta.</Message>
                <Button className="btn--full" onClick={() => navigate("login")}>Entrar para contratar</Button>
              </>
            )}
          </DialogPanel>
        </div>
      </main>
    </div>
  );
}

function Account({ navigate, logout }: { navigate: (screen: Screen) => void; logout: () => void }) {
  const [provider, setProvider] = useState(true);
  return (
    <div className="catalog-page scene">
      <Header loggedIn navigate={navigate} logout={logout} />
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate("catalog")}>← Voltar ao catálogo</Button>
        <div className="account-title"><p className="eyebrow">PLAYER PROFILE</p><h1>Minha conta</h1></div>
        <div className="detail-grid">
          <DialogPanel>
            <div className="account-player"><span className="avatar avatar--large avatar--blue">FL</span><div><h2>Fulano</h2><p>@FulanoPlayer</p></div></div>
            <dl className="account-data"><div><dt>E-mail</dt><dd>gamer@gameduo.com</dd></div><div><dt>Telefone</dt><dd>(11) 99999-0000</dd></div><div><dt>Saldo</dt><dd><PixelIcon type="coin" /> 480 créditos</dd></div></dl>
          </DialogPanel>
          <DialogPanel>
            <p className="eyebrow">MODO PRESTADOR</p><h2>Ofereça seus serviços</h2>
            <p className="detail-copy">Ative seu perfil para publicar sessões de coaching ou encontrar jogadores como duo.</p>
            <button className={`toggle-card ${provider ? "active" : ""}`} onClick={() => setProvider(!provider)} role="switch" aria-checked={provider}>
              <span><b>Perfil de prestador</b><small>{provider ? "Visível no marketplace" : "Oculto no marketplace"}</small></span><i>{provider ? "ON" : "OFF"}</i>
            </button>
            <Button className="btn--full" disabled={!provider}>Gerenciar minhas ofertas</Button>
          </DialogPanel>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("catalog");
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer>(offers[0]);
  const [loginSuccess, setLoginSuccess] = useState("");
  const navigate = (next: Screen) => { setScreen(next); window.scrollTo(0, 0); };
  const logout = () => { setLoggedIn(false); navigate("catalog"); };
  if (screen === "login") return <Login navigate={navigate} success={loginSuccess} onLogin={() => { setLoggedIn(true); setLoginSuccess(""); navigate("catalog"); }} />;
  if (screen === "register") return <Register navigate={navigate} onSuccess={() => { setLoginSuccess("Conta criada com sucesso!"); navigate("login"); }} />;
  if (screen === "recover") return <Recover navigate={navigate} />;
  if (screen === "code") return <CodeValidation navigate={navigate} />;
  if (screen === "new-password") return <NewPassword navigate={navigate} />;
  if (screen === "password-changed") return <PasswordChanged navigate={navigate} />;
  if (screen === "details") return <OfferDetails offer={selectedOffer} loggedIn={loggedIn} navigate={navigate} />;
  if (screen === "account") return <Account navigate={navigate} logout={logout} />;
  return <Catalog loggedIn={loggedIn} navigate={navigate} logout={logout} onSelectOffer={(offer) => { setSelectedOffer(offer); navigate("details"); }} />;
}
