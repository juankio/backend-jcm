import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const autMiddleware = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password -verified -token -__v");
      next();
    } catch (error) {
      const err = new Error('Token no valido');
      res.status(403).json({ msg: err.message });
    }
  } else {
    const error = new Error('Token no valido o inecistente');
    res.status(403).json({ msg: error.message });
  }
};

export default autMiddleware;