import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Volta a página para o topo sempre que a rota muda.
// Não desenha nada na tela, por isso não tem .css.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
