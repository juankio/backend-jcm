// index.js o server.js
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import { db } from './config/db.js';
import servicesRoutes from './routes/servicesRouetes.js';
import authRoutes from './routes/authRoutes.js';
import appointmentsRoutes from './routes/appointmentsRoutes.js';
import comentariosRoutes from './routes/comentariosRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Variables de entorno
dotenv.config();

// App
const app = express();

// Leer datos del body
app.use(express.json());

// Conectar a la base de datos
db();

// Lista de cors
const whitelist = [process.env.FRONTEND_URL, undefined];

// Configurar las cors
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Error de CORS'));
    }
  }
};
app.use(cors(corsOptions));

// Rutas
app.use('/api/services', servicesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/comentarios', comentariosRoutes); // Asegúrate de que esta ruta sea correcta
app.use('/api/user', userRoutes);

// Puerto
const PORT = process.env.PORT || 4000;

// Arranque
app.listen(PORT, () => {
  console.log(colors.yellow.bold(`El servidor está funcionando en el puerto: ${PORT}`));
});
