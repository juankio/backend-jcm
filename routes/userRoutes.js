import express from 'express'
import autMiddleware from '../middleware/authMiddleware.js'
import { getUserAppointmets } from '../controllers/userControlller.js'
const router = express.Router()

router.route('/:user/appointments')
    .get(autMiddleware, getUserAppointmets)

export default router