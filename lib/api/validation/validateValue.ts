import { ValidationRule } from "@/lib/types/types";

const validateValue = (value: any, rules: ValidationRule, key: string) => {
  if (rules.required && !value) {
    return { valid: false, error: `Le champ ${key} est requis`, status: 400 };
  }

  if (value && rules.type) {
    if (rules.type === "date" && isNaN(Date.parse(value))) {
      return {
        valid: false,
        error: `Le champ ${key} doit être une date valide`,
        status: 400,
      };
    }
    if (rules.type !== "date" && typeof value !== rules.type) {
      return {
        valid: false,
        error: `Le champ ${key} doit être de type ${rules.type}`,
        status: 400,
      };
    }
  }
  return { valid: true };
};

export default validateValue;
