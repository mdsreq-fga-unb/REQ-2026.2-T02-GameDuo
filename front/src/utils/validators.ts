export const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

/** Telefone com DDD: pelo menos 10 dígitos, ignorando máscara. */
export const isValidPhone = (value: string) => value.replace(/\D/g, "").length >= 10;

export const onlyDigits = (value: string) => value.replace(/\D/g, "");
