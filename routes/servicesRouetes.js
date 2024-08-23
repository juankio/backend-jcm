// routes/servicesRoutes.js
import express from "express";
import { getServices, createServis, getServiceById, updateService, deleteService } from '../controllers/servicesController.js';
import { valideObjetIdUser, valideObjetIdAdmin } from '../utils/index.js';

const router = express.Router();

router.route('/')
  .post(createServis)
  .get(getServices);

router.route('/:id')
  .get(valideObjetIdUser, getServiceById)
  .put(valideObjetIdAdmin, updateService)
  .delete(valideObjetIdUser, deleteService);

export default router;
