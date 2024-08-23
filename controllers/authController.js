import User from '../models/User.js';
import {sendEmailVerification, sendEmailResetPassword} from '../emails/authEmail.js'
import {generateJWT, uniqueId} from '../utils/userUtils.js'
import { json } from 'express';


const register = async(req,res)=>{
    if (Object.values(req.body).includes('')) {
        const error= new  Error('Todos los campos son obligatorios')

        return res.status(400).json({
           msg:error.message
       })

    }
    // evitar registros duplicados
    const {email, password, name}= req.body

    const userExists = await User.findOne({email})
    if(userExists){
        const error= new  Error('Ya existe un usario con ese correo')

        return res.status(400).json({
           msg:error.message
       })
    }
    
    //validar password
    const MIN_PASSWORD_LENGTH = 8
    if(password.trim().length < MIN_PASSWORD_LENGTH ){
        const error= new  Error(`El password debe contener minimo ${MIN_PASSWORD_LENGTH} caracteres`)

        return res.status(400).json({
           msg:error.message
       })
    }else{

    }
    

    try {
        const user= new User(req.body)
        const result = await user.save()
        console.log(result)
        const {name, email,token}= result
        sendEmailVerification({ name,email, token})

        res.json({
            msg:'El usuario se creo correctamente, revisa tu email'
        })
    } catch (error) {
        console.log(error)
        
    }
}
const verifyAcconunt = async(req, res)=>{
    const {token} = req.params

    const user = await User.findOne({token})
    if(!user){
        const error = new Error('Hubo un error, token no valido')
        return res.status(401).json({msg:error.message})
    }
    try {
        user.verified= true
        user.token = ''
        await user.save()
        res.json({msg: 'usario confrimado Correctamente'})
    } catch (error) {
        console.log(error)
        
    }
    
}
const login= async(req, res)=>{
    const {email,password}= req.body
    // revisar
    const user =await User.findOne({email})
    if(!user){
        const error = new Error('El usuario no existe')
        return res.status(401).json({msg:error.message})
    }
    if(!user.verified){
        const error = new Error('Tu cuenta no ha sido confirmada aun')
        return res.status(401).json({msg:error.message})
    }
    if (await user.checkPassword(password)) {
        const token= generateJWT(user._id)
        
        res.json({
            token
        })
    }else{
        const error = new Error('El password es incorrecto')
        return res.status(401).json({msg:error.message})
    }
}
const forgotPassword = async(req,res)=>{
    const {email}=req.body
    const user = await User.findOne({email})
    if(!user){
        const error = new Error('El correo no existe')
        return res.status(404).json({msg:error.message})
    }
    try {
        user.token= uniqueId()
       const result= await user.save()

        await sendEmailResetPassword({
            name: result.name,
            email:result.email,
            token:result.token
        })

        res.json({
            msg:'Hemos enviado un email con las instrucciones'
        })
    } catch (error) {
        console.log(error)
    }
}

const verifyResetPassword  = async(req,res)=>{
    const {token} = req.params

    const isValidToken = await User.findOne({token})
    if (!isValidToken) {
        const error = new Error('Hubo un Error, Token no valido')
        return res.status(400).json({msg:error.message})
    }
   return res.json({msg:'Token Valido'})
}
const updatePassword  = async(req,res)=>{
    const {token} = req.params

    const user = await User.findOne({token})
    if (!user) {
        const error = new Error('Hubo un Error, Token no valido')
        res.status(400).json({msg:error.message})
    }
    const {password} = req.body
    try {
        user.token=''
        user.password=password
        await user.save()
        res.json({msg:'Pasword modificado correctamente'})
    } catch (error) {
        console.log(error)
        
    }
}


const user = async(req,res)=>{
    const {user} = req
    res.json(user)
}

const admin = async(req,res)=>{
    
    const {user} = req
    if(!user.admin){
        const error = new Error('Accion no valida')
        return res.status(403).json({msg:error.message})
    }    
     res.json(user)
}


export{
    register,
    verifyAcconunt,
    login,
    forgotPassword,
    verifyResetPassword,
    updatePassword,
    user,
    admin
}