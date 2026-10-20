export const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

// Telefone com DDD: pelo menos 10 dígitos, ignorando máscara.
export const isValidPhone = (value) => value.replace(/\D/g, "").length >= 10;

export const onlyDigits = (value) => value.replace(/\D/g, "");

// Regras de senha forte, exibidas como checklist na tela de nova senha.
export const passwordRules = [
  { label: "Pelo menos 8 caracteres", test: (value) => value.length >= 8 },
  { label: "Uma letra maiúscula", test: (value) => /[A-Z]/.test(value) },
  { label: "Um número", test: (value) => /\d/.test(value) },
  { label: "Um símbolo especial", test: (value) => /[^A-Za-z0-9]/.test(value) },
];

export const isStrongPassword = (value) => passwordRules.every((rule) => rule.test(value));
