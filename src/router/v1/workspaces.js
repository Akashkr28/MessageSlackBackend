import express from "express";

import { addChannelToWorkspaceController, addMemberToWorkspaceController, createWorkspaceController, deleteWorkSpaceController, getWorkspaceByJoinCodeController, getWorkspaceController, getWorkspaceUserIsMemberOfController, joinWorkspaceController, resetJoinCodeController, updateWorkspaceController } from "../../controllers/workspaceController.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import { addChannelToWorkspaceSchema, addMemberToWorkspaceSchema, createWorkspaceSchema } from "../../validators/workspaceSchema.js";
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

router.get('/:join/:joinCode', isAuthenticated, getWorkspaceByJoinCodeController);

router.put('/:workspaceId/join', isAuthenticated, joinWorkspaceController);

router.put('/:workspaceId', isAuthenticated, updateWorkspaceController);

router.put('/:workspaceId/members', isAuthenticated, validate(addMemberToWorkspaceSchema),addMemberToWorkspaceController);

router.put('/:workspaceId/channels', isAuthenticated, validate(addChannelToWorkspaceSchema), addChannelToWorkspaceController);

router.put('/:workspaceId/joinCode/reset', isAuthenticated, resetJoinCodeController);

export default router;