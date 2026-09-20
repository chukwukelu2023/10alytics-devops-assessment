import { Request,Response } from "express";
import {completeTaskService, getTask,getTasks,removeTask,saveTask, updateTask} from '../services/taskService'
import ITask from "../interface/taskInterface";

export const createTask = async(req:Request,res:Response)=>{
    const userId = req.user
    const body = req.body
    try {
        const task = await saveTask({...body,userId})
        if(!task){
            return res.status(400).send('Error Creating Task')
        }
        return res.status(201).send({message:'Task Succusefully Created'})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message:'Error Creating Task'})
    }
}

export const getAllTasks = async(req:Request,res:Response)=>{
    try {
        const tasks = await getTasks()
        return res.status(200).send(tasks)
    } catch (error) {
        return res.send(error)
    }
}

export const getTaskById = async(req:Request,res:Response)=>{
    const userId = req.user
    const body = req.body
    try {
        const task = await getTask(+req.params.id)
        if(!task){
            return res.status(404).send({message:"Task does not exist"})
        }
        return res.status(200).send(task)
    } catch (error) {
        return res.send(error)
    }
}

export const updateTaskRecord = async(req:Request,res:Response)=>{
    const id = req.params.id as unknown as number
    const userId = req.user
    if(id && isNaN(id)){
        return res.status(400).send({message:"Enter a valid Task Id"})
    }
    const savedtask = await getTask(+id) as unknown as ITask
    const {userId: savedUserId}:any = savedtask

    if(savedUserId !== userId){
        return res.status(403).send({message:"Task does not belong to you"})
    }
    const body = req.body
    if(savedtask && savedtask.status === 'COMPLETED'){
        return res.status(400).send({message:'Cannot Update Status of Completed task'})
    }
    try {
        const updatedTask = await updateTask(+id,body)
        if(!updatedTask){
            return res.status(400).send({message:'Error Updating Task'})
        }
        return res.status(200).send({message:'Task Succusefully Updated'})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message:"Error Updating Task"})
    }
}

export const deletetask = async(req:Request,res:Response)=>{
    const userId = req.user
    const taskId = req.params.id as unknown as number
    try {
        if(taskId && isNaN(taskId)){
            return res.status(400).send({message:"Enter a valid Task Id"})
        }
        const task = await getTask(+req.params.id)
        if(!task){
            return res.status(404).send({message:"Task does not exist"})
        }
        if(task.userId !== userId){
            return res.status(403).send({message:"Task does not belong to you"})
        }
        await removeTask(task)
        return res.status(200).send({message:"Task removed succesfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message:"Error deleting task"})
    }
}

export const completeTaskController = async(req:Request,res:Response)=>{
    const userId = req.user
    const taskId = req.params.id as unknown as number
    try {
        if(taskId && isNaN(taskId)){
            return res.status(400).send({message:"Enter a valid Task Id"})
        }
        const task = await getTask(+req.params.id)
        if(!task){
            return res.status(404).send({message:"Task does not exist"})
        }
        if(task.userId !== userId){
            return res.status(403).send({message:"Task does not belong to you"})
        }
        await completeTaskService(+req.params.id)
        return res.status(200).send({message:"Task completed succesfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message:"Error completing task"})
    }
}
