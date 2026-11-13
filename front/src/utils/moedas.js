export const pacotes = [
  { id: "basico", nome: "Básico", moedas: 50, valor: 50, nivel: 1 },
  { id: "padrao", nome: "Padrão", moedas: 100, valor: 100, nivel: 2 },
  { id: "plus", nome: "Plus", moedas: 250, valor: 250, nivel: 3 },
  { id: "pro", nome: "Pro", moedas: 500, valor: 500, nivel: 4 },
];

export const EVENTO_CARTEIRA = "gameduo:carteira-atualizada";

export const avisarCarteiraAtualizada = () => window.dispatchEvent(new Event(EVENTO_CARTEIRA));

export const formasPagamento = [
  { id: "pix", nome: "Pix", descricao: "Pague pelo app do seu banco.", icone: "pix" },
  { id: "cartao", nome: "Cartão", descricao: "Pague com cartão de crédito.", icone: "card" },
];

export const nomePacote = (id) => pacotes.find((pacote) => pacote.id === id)?.nome ?? id;

export const nomeForma = (id) => formasPagamento.find((forma) => forma.id === id)?.nome ?? id;

export function formatarReais(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return "—";
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const formatarMoedas = (quantidade) => Number(quantidade ?? 0).toLocaleString("pt-BR");

function paraData(valor) {
  if (!valor) return null;
  const data = new Date(typeof valor === "string" ? valor.replace(" ", "T") : valor);
  return Number.isNaN(data.getTime()) ? null : data;
}

export function formatarData(valor) {
  const data = paraData(valor);
  if (!data) return "—";
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatarDataHora(valor) {
  const data = paraData(valor);
  if (!data) return "—";
  return data.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function mascararCpf(valor) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  return digitos
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

export const statusCobranca = {
  pendente: { rotulo: "Aguardando pagamento", tom: "pendente" },
  paga: { rotulo: "Pagamento confirmado", tom: "paga" },
  vencida: { rotulo: "Tempo esgotado", tom: "encerrada" },
  cancelada: { rotulo: "Pedido cancelado", tom: "encerrada" },
};

export const tiposMovimento = {
  compra: { rotulo: "Compra", tom: "entrada" },
  contratacao: { rotulo: "Contratação", tom: "saida" },
  devolucao: { rotulo: "Devolução", tom: "devolucao" },
};
