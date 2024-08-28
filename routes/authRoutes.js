import express from 'express'
import {register,verifyAccount, login, user,forgotPassword,verifyResetPassword,updatePassword,admin} from '../controllers/authController.js'
import autMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register',register)
router.get('/verify/:token',verifyAccount )
router.post('/login', login )
router.post('/forgot-password', forgotPassword )
router.route('/forgot-password/:token' )
    .get(verifyResetPassword)
    .post(updatePassword)

router.get('/user',autMiddleware, user)
router.get('/admin',autMiddleware, admin)




export default router