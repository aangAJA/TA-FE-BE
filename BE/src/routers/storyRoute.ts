import express from "express";
import { storyUpload } from "../middlewares/fileUploadConfig";
import { verifyRole, verifyToken } from "../middlewares/auth"
import { 
    getMyStories,
    getAllStories, 
    getStoryID, 
    createStory, 
    updateStory, 
    deleteStory 
} from "../controllers/storyController";

const router = express.Router();

router.get("/",[verifyToken], getAllStories);
router.get("/read/:id",getStoryID);
router.post("/create", [verifyToken], storyUpload, createStory);
router.put("/update/:id", [verifyToken],storyUpload, updateStory);
router.delete("/delete/:id", deleteStory);
router.get('/c/me', verifyToken, getMyStories);

export default router;