import express from 'express'
import { createComentario,getComentario,getComentarioServicio} from '../controllers/ComentariosController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .post(authMiddleware, createComentario)
    .get(authMiddleware, getComentario)
    
router.route('/:services')
    .get(authMiddleware, getComentarioServicio)


export default router