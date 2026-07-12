import {Router} from "express";
import {checkAdmin, createAlbum, createSongs, deleteAlbum, deleteSong} from "../controllers/admin.controller.js";
import {protectRoute, requireAdmin} from "../middleware/auth.middleware.js";

const router = Router()
router.use(protectRoute, requireAdmin)
router.get("/check", checkAdmin);
router.post("/songs", createSongs)
router.delete("/songs/:id", deleteSong)
router.post("/albums", createAlbum)
router.delete("/albums/:id", deleteAlbum)


export default router