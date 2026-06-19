import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import uploadService from "../services/upload.service";

const router = Router();

router.post("/", authenticate, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "File is required",
    });
  }

  const result = await uploadService.uploadMedia(req.creatorId!, req.file);

  return res.json({
    url: result.url,
  });
});

router.post("/presign", authenticate, async (req, res) => {
  try {
    const { filename, contentType } = req.body;

    if (!filename || !contentType) {
      return res.status(400).json({
        message: "filename and contentType are required",
      });
    }

    const result = await uploadService.generatePresignedUploadUrl(
      req.creatorId!,
      filename,
      contentType,
    );

    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

export default router;
