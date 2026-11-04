import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import './PaginaAdminUsuarios.css';
import MainLayout from '../../components/mainLayout/MainLayout';
import Button from '../../components/button/Button';
import EmptyState from '../../components/emptyState/EmptyState';
import Input from '../../components/input/Input';
import Message from '../../components/message/Message';
import Select from '../../components/select/Select';
import { api } from '../../services/api';

// Texto do seletor → valor que a API espera em ?tipo=
const tipos = {
  "Todos": "todos",
  "Somente consumidores": "consumidores",
  "Também prestadores": "prestadores",
};
const tipoOptions = Object.keys(tipos);
const POR_PAGINA = 20;

// Rota: /admin/usuarios — RF44, somente consulta.
// Busca, tipo e página ficam na URL (?busca=&tipo=&pagina=): assim o
// "Voltar à lista" do detalhe e o F5 mantêm a busca anterior.
function PaginaAdminUsuarios() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const busca = searchParams.get("busca") ?? "";
  const tipo = searchParams.get("tipo") ?? "todos";
  const pagina = Number(searchParams.get("pagina")) || 1;

  // o que está digitado no formulário (só vale para a lista ao clicar em Buscar)
  const [campoBusca, setCampoBusca] = useState(busca);
  const [campoTipo, setCampoTipo] = useState(tipoOptions.find((texto) => tipos[texto] === tipo) ?? "Todos");

  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // ignora respostas atrasadas de uma busca anterior
    let atual = true;
    const query = new URLSearchParams({ tipo, pagina, por_pagina: POR_PAGINA });
    if (busca) query.set("busca", busca);

    setResultado(null);
    setError("");
    api(`/admin/usuarios?${query}`)
      .then((data) => atual && setResultado(data))
      .catch((err) => {
        if (!atual) return;
        if (err.status === 401) {
          navigate("/login", { replace: true, state: { voltarPara: location.pathname + location.search } });
          return;
        }
        setError(err.message);
      });

    return () => {
      atual = false;
    };
  }, [busca, tipo, pagina, navigate, location.pathname, location.search]);

  const irPara = (filtros) => {
    const params = { tipo: filtros.tipo, pagina: String(filtros.pagina) };
    if (filtros.busca) params.busca = filtros.busca;
    setSearchParams(params);
  };

  const buscar = (event) => {
    event.preventDefault();
    irPara({ busca: campoBusca.trim(), tipo: tipos[campoTipo], pagina: 1 });
  };

  const limpar = () => {
    setCampoBusca("");
    setCampoTipo("Todos");
    setSearchParams({});
  };

  const verDetalhes = (email) => {
    // leva a busca atual junto, para o detalhe saber para onde voltar
    navigate(`/admin/usuarios/${encodeURIComponent(email)}`, { state: { lista: location.search } });
  };

  return (
    <MainLayout>
      <main className="detail-main">
        <Button variant="ghost" onClick={() => navigate("/admin")}>← Voltar ao painel</Button>
        <div className="admin-title">
          <p className="eyebrow">PAINEL ADMINISTRATIVO</p>
          <h1>Usuários</h1>
        </div>

        <form className="admin-filtros" onSubmit={buscar}>
          <Input label="Buscar" value={campoBusca} onChange={setCampoBusca} placeholder="Nickname ou e-mail" />
          <Select label="Tipo" value={campoTipo} options={tipoOptions} onChange={setCampoTipo} />
          <Button type="submit">Buscar</Button>
          <Button variant="link" onClick={limpar}>Limpar busca</Button>
        </form>

        {error && <Message kind="error">{error}</Message>}
        {!resultado && !error && <Message kind="info">Carregando...</Message>}

        {resultado && resultado.total === 0 && (
          <EmptyState title="Nenhum usuário encontrado" text="Nenhum usuário encontrado para a busca." />
        )}

        {resultado && resultado.total > 0 && (
          <>
            <ul className="admin-lista">
              {resultado.itens.map((item) => (
                <li key={item.email} className="admin-item">
                  <span className="admin-item__dados">
                    <b>{item.nickname}</b>
                    <small>{item.email_mascarado}</small>
                    <small>Presta serviço: {item.presta_servico ? "Sim" : "Não"}</small>
                  </span>
                  <Button variant="secondary" onClick={() => verDetalhes(item.email)}>Ver Detalhes</Button>
                </li>
              ))}
            </ul>

            <nav className="admin-paginacao" aria-label="Paginação">
              <Button variant="ghost" disabled={pagina <= 1} onClick={() => irPara({ busca, tipo, pagina: pagina - 1 })}>‹ Anterior</Button>
              <span>Página {resultado.pagina} de {resultado.ultima_pagina}</span>
              <Button variant="ghost" disabled={pagina >= resultado.ultima_pagina} onClick={() => irPara({ busca, tipo, pagina: pagina + 1 })}>Próxima ›</Button>
            </nav>
          </>
        )}
      </main>
    </MainLayout>
  );
}

export default PaginaAdminUsuarios;
