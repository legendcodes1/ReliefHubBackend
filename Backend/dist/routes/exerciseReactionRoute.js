import { Router } from 'express';
import { setReactionController, removeReactionController, getReactionController, getBatchReactionsController, } from '../controllers/exerciseReactionController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const reactionRouter = Router();
reactionRouter.post('/', requireAuth, setReactionController);
reactionRouter.delete('/:exerciseId', requireAuth, removeReactionController);
reactionRouter.get('/:exerciseId', requireAuth, getReactionController);
reactionRouter.get('/', requireAuth, getBatchReactionsController);
export default reactionRouter;
