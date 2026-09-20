import { Tasks } from "../models/task";

const date = new Date().toLocaleDateString()
const saveTask = async(body:any)=>{
    const task = await Tasks.create(body)
    return task
}

const getTasks = async()=>{
    return await Tasks.findAll()
}

const getTask = async(id:number)=>{
    return await Tasks.findByPk(id)
    
}

const removeTask = async(task:Tasks)=>{
    await task.destroy()
    
}

const updateTask = async(id:number, body:any)=>{
    const task :any= await getTask(id)
    const payload:any =  {}
    payload.title = body.title || task?.title
    payload.description = body.description || task?.description
    payload.status = body.status || task?.status
    return task?.update(payload)
}

const completeTaskService = async(id:number)=>{
    const task = await getTask(id)
    return task?.update({status:"COMPLETED",dateCompleted:new Date()})
}

export {
    saveTask,
    getTask,
    getTasks,
    updateTask,
    removeTask,
    completeTaskService
}