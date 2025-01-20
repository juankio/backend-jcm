import express from "express";
import {
  getServices,
  createService,
  getServiceById,
  updateService,
  deleteService,
  uploadServiceImage,
  getServiceImages,
  deleteServiceImage,
} from "../controllers/servicesController.js";
import upload from '../middleware/uploadMiddleware.js'; 

const router = express.Router();

router.route("/")
  .post(createService) // Aquí debe ser una función válida
  .get(getServices);

router.route("/:id")
  .get(getServiceById)
  .put(updateService)
  .delete(deleteService);

  router.route("/:id/images")
  .post(upload.single('image'), uploadServiceImage)
  .get(getServiceImages);

router.route("/:id/images/:imageId")
  .delete(deleteServiceImage);

export default router;
