// Horários sempre no fuso de Brasília, o mesmo da agenda do prestador.
const FUSO = "America/Sao_Paulo";

export const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const comunicacoes = ["Discord", "WhatsApp", "Telegram", "Chat do jogo", "Outro"];

export const formatos = ["Individual", "Em grupo", "Ao vivo", "Análise de partidas"];

export const idiomas = ["Português", "Inglês", "Espanhol"];

export const tiposChave = { CPF: "CPF", EMAIL: "E-mail", PHONE: "Celular", EVP: "Chave aleatória" };

export const statusContratacao = {
  agendada: { rotulo: "Agendada", tom: "azul" },
  em_analise: { rotulo: "Em análise", tom: "amarelo" },
  concluida: { rotulo: "Concluída", tom: "verde" },
  cancelada: { rotulo: "Cancelada", tom: "cinza" },
  devolvida: { rotulo: "Moedas devolvidas", tom: "cinza" },
};

export const resultados = {
  ocorreu: "A sessão ocorreu",
  nao_ocorreu: "A sessão não ocorreu",
  problema: "A sessão teve problemas",
};

export const statusSaque = {
  solicitado: "Solicitado",
  processando: "Processando",
  verificacao: "Em verificação",
  pago: "Pago",
  falhou: "Não concluído",
};

export function formatarDia(valor) {
  return new Date(valor).toLocaleDateString("pt-BR", { timeZone: FUSO, weekday: "long", day: "2-digit", month: "2-digit" });
}

export function formatarHora(valor) {
  return new Date(valor).toLocaleTimeString("pt-BR", { timeZone: FUSO, hour: "2-digit", minute: "2-digit" });
}

export const formatarSessao = (valor) => `${formatarDia(valor)}, ${formatarHora(valor)}`;

// [{ inicio, fim }] → [{ dia, vagas }]
export function agruparPorDia(vagas) {
  const grupos = new Map();
  vagas.forEach((vaga) => {
    const dia = formatarDia(vaga.inicio);
    grupos.set(dia, [...(grupos.get(dia) ?? []), vaga]);
  });
  return [...grupos].map(([dia, doDia]) => ({ dia, vagas: doDia }));
}
