import type { RequestHandler } from "express";
import type { ZodType } from "zod";

const validate = (schema: ZodType): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  };
};

export { validate };
