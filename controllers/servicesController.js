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
  console.log("Datos recibidos en el backend:", req.body); // 👀 Verifica qué está llegando

  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios');
    return res.status(400).json({ msg: error.message });
  }

  try {
    const service = new Services(req.body);
    await service.save();
    res.status(201).json({ msg: "Servicio creado correctamente", _id: service._id });
    
    
  } catch (error) {
    console.error("Error en createService:", error);
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

  console.log("📤 Subiendo imagen para el servicio:", id);
  console.log("📦 req.file:", req.file); // 🔥 Debug para ver si `req.file` está presente

  const service = await Services.findById(id);
  if (!service) {
    return res.status(404).json({ msg: "El servicio no existe" });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No se envió ninguna imagen" });
    }

    // 🔥 Subir desde buffer en vez de req.file.path
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `services/${id}` },
      async (error, uploadResult) => {
        if (error) {
          console.error("❌ Error al subir imagen a Cloudinary:", error);
          return res.status(500).json({ msg: "Error al subir la imagen", error: error.message });
        }

        service.images.push(uploadResult.secure_url);
        await service.save();

        res.json({ msg: "Imagen subida correctamente", imageUrl: uploadResult.secure_url });
      }
    );

    uploadStream.end(req.file.buffer); // 📤 Subir desde memoria

  } catch (error) {
    console.error("❌ Error general en la subida:", error);
    res.status(500).json({ msg: "Error al subir la imagen", error: error.message });
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
