import type { RequestHandler } from "express";

const asyncHandler = (requestHandler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export { asyncHandler };
