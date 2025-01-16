// routes/servicesRoutes.js
import express from "express";
import { getServices, createService, getServiceById, updateService, deleteService } from '../controllers/servicesController.js';
import { valideObjetIdUser, valideObjetIdAdmin } from '../utils/index.js';

const router = express.Router();

router.route('/')
  .post(createService)
  .get(getServices);

router.route('/:id')
  .get(valideObjetIdUser, getServiceById)
  .put(valideObjetIdAdmin, updateService)
   .delete(deleteService);

export default router;
