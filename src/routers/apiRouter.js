import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
  thumbsUpComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment/delete", deleteComment);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment/thumb", thumbsUpComment);

export default apiRouter;
