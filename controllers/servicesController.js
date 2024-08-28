import Services from '../models/Service.js';
import { handleNotFoundError } from '../utils/index.js';

const createService = async (req, res) => {
  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios');
    return res.status(400).json({ msg: error.message });
  }
  try {
    const service = new Services(req.body);
    await service.save();
    res.json({ msg: "El servicio se creó correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al crear el servicio' });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Services.find();
    res.json(services);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al obtener los servicios' });
  }
};

const getServiceById = async (req, res) => {
  const { id } = req.params;

  const service = await Services.findById(id);
  if (!service) {
    return handleNotFoundError('El servicio no existe', res);
  }
  res.json(service);
};

const updateService = async (req, res) => {
  const { id } = req.params;

  const service = await Services.findById(id);
  if (!service) {
    return handleNotFoundError('El servicio no existe', res);
  }
  
  // Actualizar los valores
  service.name = req.body.name || service.name;
  service.price = req.body.price || service.price;

  try {
    await service.save();
    res.json({ msg: 'El servicio se actualizó correctamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al actualizar el servicio' });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;

  const service = await Services.findById(id);
  if (!service) {
    return handleNotFoundError('El servicio no existe', res);
  }
  try {
    await service.deleteOne();
    res.json({ msg: 'El servicio se eliminó correctamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al eliminar el servicio' });
  }
};

export {
  getServices,
  createService,
  getServiceById,
  updateService,
  deleteService
};
