import {Request, Response,NextFunction} from "express"
import { verifyToken } from "./token"

export const authenticateuser = async (req:Request,res:Response,next:NextFunction)=>{
    const {authorization} = req.headers
    if(!authorization){
    return res.status(401).send({message:"Not Authenticated"})

    }
    const token = authorization?.split(" ")[1] as string

    try {
        const verify = await verifyToken(token)
        if(!verify){
           return res.status(401).send({message:"Not Authenticated"})
        }
        const {id,admin} = verify
       req.user = id
       req.admin = admin
       next()
    } catch (error) {
        return res.status(401).send({message:"Invalid Token"})
    }
    
}

export const adminUser = async(req:Request,res:Response,next:NextFunction)=>{
    const admin = req.admin
    if(!admin){
        return res.status(403).send({message:"Not Authorized"})
    }
    next()    
}