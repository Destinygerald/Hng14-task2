import { Router } from "express";
import { getProfiles, searchForProfile } from "../controllers/index.js";
import { asyncHandler } from "../middleware/error-handler.js";

export const Routes = Router();

Routes.get("/", asyncHandler(getProfiles));
Routes.get("/search", asyncHandler(searchForProfile));
