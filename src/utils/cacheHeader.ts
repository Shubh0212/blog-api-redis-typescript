import { Response } from "express";

export const setCacheHeader = (res: Response, hit: boolean) => {
  res.setHeader("X-Cache", hit ? "HIT" : "MISS");
};
