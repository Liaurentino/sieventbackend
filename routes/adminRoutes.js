import express from "express";
import {
  getSiCreatorRequests,
  acceptSiCreatorRequest,
  SeeRequestSiCreators,
} from "../controllers/adminController.js";
import upload from "../middleware/upload.js";
import { isAuthenticated } from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * /sicreator/requests:
 *   get:
 *     summary: Mendapatkan daftar permintaan menjadi SiCreator
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar permintaan
 */
router.post("/sicreator/requests", isAuthenticated, upload.single("ktp"), getSiCreatorRequests);

/**
 * @swagger
 * /sicreator/accept/{userId}:
 *   post:
 *     summary: Menerima permintaan menjadi SiCreator
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID pengguna yang akan diterima sebagai SiCreator
 *     responses:
 *       200:
 *         description: Permintaan berhasil diterima
 */
router.post("/sicreator/accept/:userId", acceptSiCreatorRequest);
/**
 * @swagger
 * /sicreator/seerequests:
 *   post:
 *     summary: Melihat permintaan untuk menjadi Si Creator
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Melihat Permintaan dari User untuk Request Creator
 *     responses:
 *       200:
 *         description: Permintaan berhasil diterima
 */
router.get("/sicreator/seerequests", SeeRequestSiCreators);

export default router;
