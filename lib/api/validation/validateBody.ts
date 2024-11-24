import { ValidationResponse, ValidationRule } from "@/lib/types";
import logError from "@/lib/utils/logging/logs";
import validateValue from "./validateValue";

const validateBody = (
  body: any,
  schema: Record<string, ValidationRule>,
  fileName: string
): ValidationResponse => {
  const validatedBody: Record<string, any> = {};

  for (const [key, rules] of Object.entries(schema)) {
    const value = body[key];
    const validation = validateValue(value, rules, key);

    if (!validation.valid) {
      logError(
        fileName,
        "validateBody",
        `Validation échouée: ${validation.error}`
      );
      return validation;
    }

    if (value !== undefined) {
      validatedBody[key] = rules.type === "date" ? new Date(value) : value;
    }
  }

  return { valid: true, data: { body: validatedBody } };
};

export default validateBody;
