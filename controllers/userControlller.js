import Appointment from "../models/appointment.js";

const getUserAppointments= async (req, res, next) => {
    const { user } = req.params;

    if (!user || !req.user) {
        const error = new Error('Parámetros inválidos');
        return res.status(400).json({ msg: error.message });
    }

    if (user !== req.user._id.toString()) {
        const error = new Error('Acceso denegado');
        return res.status(403).json({ msg: error.message });
    }

    try {
        const query = req.user.admin 
            ? { date: { $gte: new Date() } } 
            : { user, date: { $gte: new Date() } };

        const appointments = await Appointment
                                   .find(query)
                                   .populate('services')
                                   .populate({ path: 'user', select: 'name email' })
                                   .sort({ date: 'asc' });

        res.json(appointments);
    } catch (error) {
        next(error); 
    }    
};

export {getUserAppointments};