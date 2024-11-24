import { ValidationResponse, ValidationRule } from "@/lib/types";
import logError from "@/lib/utils/logging/logs";
import validateValue from "./validateValue";

const validateQueryParams = (
  queryString: string | undefined,
  schema: Record<string, ValidationRule>,
  fileName: string
): ValidationResponse => {
  const queryParams = new URLSearchParams(queryString?.split("?")?.[1] ?? "");
  const validatedQuery: Record<string, any> = {};

  for (const [key, rules] of Object.entries(schema)) {
    const value = queryParams.get(key);

    const validation = validateValue(value, rules, key);
    if (!validation.valid) {
      logError(
        fileName,
        "validateRequest",
        `Validation échouée: ${validation.error}`
      );
      return {
        valid: false,
        error: validation.error,
        status: validation.status ?? 400,
      };
    }

    if (value) {
      validatedQuery[key] = rules.type === "number" ? Number(value) : value;
    }
  }
  return { valid: true, data: { query: validatedQuery } };
};

export default validateQueryParams;
