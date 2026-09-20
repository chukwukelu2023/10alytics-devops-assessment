import { Request,Response } from "express";
import os from 'os'

import {findUserByEmail, getAllUsers, getUserById, removeUser,saveUser,updateUser} from "../services/userService"


export const createUser = async (req:Request, res:Response) =>{
    try {
        const user = await findUserByEmail(req.body.email)
        if(user){
            return res.status(409).send({message:"User Exist already"})
        }
        await saveUser(req.body)
        return res.status(201).send({message:"User registered Sucessfully"})
      
    } catch (error) {
        console.log(error)
        return res.send({message:"Error Registerd User"})
    }
}

export const getUsers =async (req:Request, res:Response) => {
    try {
        const users = await getAllUsers()
        
        return res.status(200).send(users)
    } catch (error) {
        return res.send(error)
    }
}

export const getCurrentUser = async(req:Request,res:Response)=>{
    const osArch = os.arch()
    const hostname = os.hostname()
    const machine = os.machine()
    const release = os.release()
    const version = os.version()
    const type = os.type()
    const network = os.networkInterfaces()
    let address = ""
    let mac = ""
    if(network && network.lo){
       address=  network.lo[0].address
       mac = network.lo[0].mac
    }
    
    const serverDetails = {
        osArch,
        hostname,
        machine,
        release,
        version,
        type,
        network:{
            address,
            mac
        }
    }
    
    try {
        const id = req.user
        const user = await getUserById(+id)
       return res.status(200).send({user,serverDetails})
    } catch (error) {
        return res.send(error)
    }

}

export const getUser =async (req:Request, res:Response) => {
    try {
        const id = req.params.id
        const user = await getUserById(+id)
        if(!user){
            return res.status(404).send({message:"User Does not Exist"})
        }
       return res.status(200).send(user)
    } catch (error) {
        return res.send(error)
    }
}

export const updateOneUser = async (req:Request, res:Response)=>{
    try{
        const id = req.params.id
        const user = await updateUser(+id,req.body)
        return res.status(200).send(user)
    }catch(error){
        return res.send(error)
    }
}

export const deleteUser = async (req:Request,res:Response)=>{
    try {
        const id = req.params.id
        await removeUser(+id)
        return res.status(200).send({message:"User Deleted Succesfully"})
    } catch (error) {
        return res.send(error)
    }
}