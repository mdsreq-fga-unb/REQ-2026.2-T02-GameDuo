export const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

export const onlyDigits = (value) => value.replace(/\D/g, "");

// Regras de senha forte, exibidas como checklist na tela de nova senha.
export const passwordRules = [
  { label: "Pelo menos 8 caracteres", test: (value) => value.length >= 8 },
  { label: "Uma letra maiúscula", test: (value) => /[A-Z]/.test(value) },
  { label: "Um número", test: (value) => /\d/.test(value) },
  { label: "Um símbolo especial", test: (value) => /[^A-Za-z0-9]/.test(value) },
];

export const isStrongPassword = (value) => passwordRules.every((rule) => rule.test(value));
