import express from 'express';

import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { isMemberPartOfWorkspaceController } from '../../controllers/memberController.js';

const router = express.Router();

router.get('/workspace/:workspace', isAuthenticated, isMemberPartOfWorkspaceController);

export default router;