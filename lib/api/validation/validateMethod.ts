import logError from "@/lib/utils/logging/logs";

const validateMethod = (
  method: string | undefined,
  allowedMethods: string[],
  fileName: string
) => {
  if (!allowedMethods.includes(method || "")) {
    logError(
      fileName,
      "validateRequest",
      `Méthode HTTP non autorisée: ${method}`
    );
    return { valid: false, error: "Méthode non autorisée", status: 405 };
  }
  return { valid: true };
};

export default validateMethod;
