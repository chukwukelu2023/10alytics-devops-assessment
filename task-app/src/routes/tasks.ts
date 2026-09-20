import {Router} from 'express';
import { completeTaskController, createTask, deletetask, getAllTasks, getTaskById, updateTaskRecord, } from '../controller/taskController';
import { adminUser, authenticateuser } from '../utility/middleware';

const router = Router()

router.use(authenticateuser)
router.get("/",adminUser, getAllTasks)
router.get("/:id",getTaskById)
router.post("/",createTask)
router.put("/update/:id",updateTaskRecord)
router.put("/complete/:id",completeTaskController)
router.delete("/:id",deletetask)


export default router