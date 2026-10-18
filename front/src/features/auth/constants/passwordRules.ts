export type PasswordRule = {
  label: string;
  test: (value: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
  { label: "Pelo menos 8 caracteres", test: (value) => value.length >= 8 },
  { label: "Uma letra maiúscula", test: (value) => /[A-Z]/.test(value) },
  { label: "Um número", test: (value) => /\d/.test(value) },
  { label: "Um símbolo especial", test: (value) => /[^A-Za-z0-9]/.test(value) },
];

export const isStrongPassword = (value: string) => passwordRules.every((rule) => rule.test(value));
