import Comentario from '../models/comentario.js';


const createComentario = async (req, res) => {
  const comentario = req.body;
  comentario.user = req.user._id; 

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

const getComentario = async (req, res) => {
  try {
    const comentarios = await Comentario.find().populate('service').populate('user');
    res.json(comentarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener comentarios.' });
  }
};

const getComentarioServicio = async (req, res) => {
  const { id } = req.params;

  try {
    const comentarios = await Comentario.find({ "service._id": id }).populate('service').populate('user');
    if (comentarios.length === 0) {
      return res.status(404).json({ msg: 'Comentarios no encontrados' });
    }
    res.status(200).json(comentarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

export {
  createComentario,
  getComentario,
  getComentarioServicio
};
