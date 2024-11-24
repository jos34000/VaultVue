export type PriceData = {
  prixOuverture: number;
  high: number;
  low: number;
  prixFermeture: number;
};

export type KlineData = {
  dateOuverture: string;
  dateFermeture: string;
  [currency: string]: PriceData | string;
};

export type ValidationResult = {
  valid: boolean;
  error: string | null;
};

export type ValidationRule = {
  required?: boolean;
  type?: "string" | "number" | "date" | "object";
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: RegExp;
};

export type ValidationSchema = {
  method: string[];
  params?: Record<string, ValidationRule>;
  query?: Record<string, ValidationRule>;
  body?: Record<string, ValidationRule>;
};

export type ValidationResponse = {
  valid: boolean;
  error?: string;
  status?: number;
  data?: {
    query?: Record<string, any>;
    body?: Record<string, any>;
    params?: Record<string, any>;
  };
};
