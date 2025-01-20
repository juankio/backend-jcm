import Services from '../models/Service.js';
import { v2 as cloudinary } from 'cloudinary';
import { handleNotFoundError } from '../utils/index.js';
import dotenv from 'dotenv';
dotenv.config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  service.description = req.body.description || service.description;

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
    return res.status(404).json({ msg: 'El servicio no existe' });
  }

  try {
    await service.deleteOne();
    res.json({ msg: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al eliminar el servicio' });
  }
};

// Subir una imagen a un servicio
const uploadServiceImage = async (req, res) => {
  const { id } = req.params;

  const service = await Services.findById(id);
  if (!service) {
    return handleNotFoundError('El servicio no existe', res);
  }

  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No se envió ninguna imagen' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `services/${id}`,
    });

    service.images.push(result.secure_url);
    await service.save();

    res.json({
      msg: 'Imagen subida correctamente',
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al subir la imagen' });
  }
};

// Obtener imágenes de un servicio
const getServiceImages = async (req, res) => {
  const { id } = req.params;

  const service = await Services.findById(id);
  if (!service) {
    return handleNotFoundError('El servicio no existe', res);
  }

  res.json(service.images);
};

// Eliminar una imagen de un servicio
const deleteServiceImage = async (req, res) => {
  const { id, imageId } = req.params;

  const service = await Services.findById(id);
  if (!service) {
    return handleNotFoundError('El servicio no existe', res);
  }

  try {
    await cloudinary.uploader.destroy(`services/${id}/${imageId}`);

    service.images = service.images.filter((image) => !image.includes(imageId));
    await service.save();

    res.json({ msg: 'Imagen eliminada correctamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al eliminar la imagen' });
  }
};

export {
  getServices,
  createService,
  getServiceById,
  updateService,
  deleteService,
  uploadServiceImage,
  getServiceImages,
  deleteServiceImage,
};
