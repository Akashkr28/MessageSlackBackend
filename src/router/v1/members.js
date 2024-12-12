import express from 'express';

import { isMemberPartOfWorkspaceController } from '../../controllers/memberController.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const router = express.Router();

router.get('/workspace/:workspace', isAuthenticated, isMemberPartOfWorkspaceController);

export default router;