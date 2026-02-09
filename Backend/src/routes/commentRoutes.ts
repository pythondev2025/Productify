import { Router } from "express";
import { requireAuth } from "@clerk/express";
import * as commentController from "../controllers/commentControllers";

const router = Router();
// POST /api/comments/:productId - create the comment for the specific product (protected)
router.post("/:productId", requireAuth(), commentController.createComment)

// DELETE /api/comments/:commentId - delete the comment for its creator
router.delete("/:commentId", requireAuth(), commentController.deleteComment)
export default router; 