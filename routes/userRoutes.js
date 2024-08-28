import express from 'express'
import autMiddleware from '../middleware/authMiddleware.js'
import {getUserAppointments} from '../controllers/userControlller.js'
const router = express.Router()

router.route('/:user/appointments')
    .get(autMiddleware, getUserAppointments)

export default router