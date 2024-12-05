import express from "express";

import { createWorkspaceController, deleteWorkSpaceController, getWorkspaceController, getWorkspaceUserIsMemberOfController } from "../../controllers/workspaceController.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import { createWorkspaceSchema } from "../../validators/workspaceSchema.js";
import { validate } from "../../validators/zodValidator.js";

const router = express.Router();

router.post(
    '/',
    isAuthenticated,
    validate(createWorkspaceSchema),
    createWorkspaceController
);

router.get('/', isAuthenticated, getWorkspaceUserIsMemberOfController);

router.delete('/:workspaceId', isAuthenticated, deleteWorkSpaceController);

router.get('/:workspaceId', isAuthenticated, getWorkspaceController);

export default router;