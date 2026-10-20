import './CatalogHero.css';

function CatalogHero() {
  return (
    <section className="catalog-hero">
      <div>
        <p className="eyebrow">FASE 01 · ESCOLHA SUA MISSÃO</p>
        <h1>Jogue melhor.<br /><span>Nunca jogue só.</span></h1>
        <p>Coaching e duos de Counter-Strike 2 e League of Legends com quem entende do seu nível e do seu objetivo.</p>
      </div>
      <div className="hero-party" aria-hidden="true">
        <span className="hero-speech">READY?</span>
        <i className="hero-char hero-char--one" />
        <i className="hero-char hero-char--two" />
      </div>
    </section>
  );
}

export default CatalogHero;
