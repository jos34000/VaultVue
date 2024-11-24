import { ValidationResponse, ValidationSchema } from "@/lib/types";
import { NextApiRequest } from "next";
import validateBody from "./validateBody";
import validateMethod from "./validateMethod";
import validateQueryParams from "./validateParams";

export function validateRequest(
  req: NextApiRequest,
  schema: ValidationSchema,
  fileName: string
): ValidationResponse {
  const methodResult = validateMethod(req.method, schema.method, fileName);
  if (!methodResult.valid) return methodResult;

  const validatedData: ValidationResponse = {
    valid: true,
    data: {},
  };

  if (schema.query) {
    const queryResult = validateQueryParams(req.url, schema.query, fileName);
    if (!queryResult.valid) return queryResult;
    validatedData.data!.query = queryResult.data?.query;
  }

  if (schema.body) {
    const bodyResult = validateBody(req.body, schema.body, fileName);
    if (!bodyResult.valid) return bodyResult;
    validatedData.data!.body = bodyResult.data?.body;
  }

  return validatedData;
}
