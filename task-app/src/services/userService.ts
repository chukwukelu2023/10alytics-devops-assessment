import { Tasks } from "../models/task";
import { User } from "../models/user";
import { hashedPassword } from "../utility/password";

const getAllUsers = async ()=>{
    return await User.findAll({attributes:['id','firstName','lastName','email'],include:Tasks})
}

const getUserById = async (id:number) =>{
    const user =  await User.findByPk(id,{attributes:['id','firstName','lastName','email'], include:Tasks})
    return user
}

const updateUser = async (id:number, body: any)=>{
    const user = await User.findByPk(id)
    if(body.password){
        body.password = await hashedPassword(body.password)
    }
   const updatedUser =  await user?.update(body)
    return updatedUser
}

const saveUser =async (body: any) => {
     body.password = await hashedPassword(body.password)
    const user = await User.create(body)
    return user
}

const removeUser=async (id:number) => {
    const user = await User.findByPk(id)
    await user?.destroy()
}

const findUserByEmail = async(email :string)=>{
    return await User.findOne({where:{email}})
} 

export{
    getAllUsers,
    getUserById,
    updateUser,
    saveUser,
    removeUser,
    findUserByEmail
}