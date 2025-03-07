import Appointment from '../models/appointment.js';
import Services from '../models/Service.js';
import { parse, formatISO, startOfDay, endOfDay, isValid } from 'date-fns';
import { valideObjetIdUser, handleNotFoundError, formatDate } from '../utils/index.js';
import { sendEmailNewAppointment, sendEmailUpdateAppointment, sendEmailCancelAppointment } from '../emails/appointmentEmailService.js';

const createAppointment = async (req, res) => {
  const { services } = req.body;

  try {
    const serviceDetails = await Services.find({ _id: { $in: services } }).select('name price');

    const appointment = new Appointment({
      ...req.body,
      user: req.user._id.toString(), 
      serviceDetails: serviceDetails.map(service => ({
        name: service.name,
        price: service.price
      }))
    });

    const result = await appointment.save();

    await sendEmailNewAppointment({
      date: formatDate(result.date),
      time: result.time,
      userEmail: req.user.email,
      userName: req.user.name,
      adminName: 'Admin'  
    });

    res.json({
      msg: 'Tu reservación se realizó correctamente'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al crear la cita' });
  }
};

const getAppointmentsByDate = async (req, res) => {
  const { date } = req.query;

  const newDate = parse(date, 'dd/MM/yyyy', new Date());

  if (!isValid(newDate)) {
    const error = new Error('Fecha no válida');
    return res.status(400).json({ msg: error.message });
  }
  const isoDate = formatISO(newDate);
  const appointments = await Appointment.find({
    date: {
      $gte: startOfDay(new Date(isoDate)),
      $lte: endOfDay(new Date(isoDate))
    }
  }).select('time');

  res.json(appointments);
};

const getAppointmentById = async (req, res) => {
  const { id } = req.params;
  if (!valideObjetIdUser(id, res)) return;

  const appointment = await Appointment.findById(id).populate('services');
  if (!appointment) {
    return handleNotFoundError('La cita no existe', res);
  }
  if (appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes los permisos');
    return res.status(403).json({ msg: error.message });
  }

  // Respuesta de la cita
  res.json(appointment);
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  if (!valideObjetIdUser(id, res)) return;

  const appointment = await Appointment.findById(id).populate('services');
  if (!appointment) {
    return handleNotFoundError('La cita no existe', res);
  }
  if (appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes los permisos');
    return res.status(403).json({ msg: error.message });
  }

  const { date, time, totalAmount, services } = req.body;
  appointment.date = date;
  appointment.time = time;
  appointment.totalAmount = totalAmount;
  appointment.services = services;

  // Actualizar `serviceDetails` con los datos correctos
  const serviceDetails = await Services.find({ _id: { $in: services } }).select('name price');
  appointment.serviceDetails = serviceDetails.map(service => ({
    name: service.name,
    price: service.price
  }));

  try {
    const result = await appointment.save();

    await sendEmailUpdateAppointment({
      date: formatDate(result.date),
      time: result.time,
      userEmail: req.user.email,
      userName: req.user.name,
      adminName: 'Admin'
    });

    res.json({
      msg: 'Cita actualizada correctamente'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al actualizar la cita' });
  }
};


const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  if (!valideObjetIdUser(id, res)) return;

  const appointment = await Appointment.findById(id).populate('services');

  if (!appointment) {
    return handleNotFoundError('La cita no existe', res);
  }

  if (appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes los permisos');
    return res.status(403).json({ msg: error.message });
  }

  try {
    await sendEmailCancelAppointment({
      date: formatDate(appointment.date),
      time: appointment.time,
      userEmail: req.user.email,
      userName: req.user.name,
      adminName: 'Admin'  
    });
    await appointment.deleteOne();

    res.json({ msg: 'Cita cancelada exitosamente' });
  } catch (error) {
    console.log(error);
  }
};

export {
  createAppointment,
  getAppointmentsByDate,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
};
