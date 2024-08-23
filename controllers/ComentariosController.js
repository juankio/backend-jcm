import Comentario from '../models/comentario.js';

// Crear un nuevo comentario
const createComentario = async (req, res) => {
  const comentario = req.body;
  comentario.user = req.user._id; // Asigna el ID del usuario autenticado

  try {
    const newComentario = new Comentario(comentario);
    await newComentario.save();

    res.json({
      msg: 'Tu comentario se creó correctamente',
      comentario: newComentario
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.'
    });
  }
};

// Obtener todos los comentarios
const getComentario = async (req, res) => {
  try {
    const comentarios = await Comentario.find().populate('service').populate('user');
    res.json(comentarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener comentarios.' });
  }
};

// Obtener comentarios por servicio
const getComentarioServicio = async (req, res) => {
  const { id } = req.params;

  try {
    const comentarios = await Comentario.find({ "service._id": id }).populate('service').populate('user');
    if (!comentarios) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export {
  createComentario,
  getComentario,
  getComentarioServicio
};
