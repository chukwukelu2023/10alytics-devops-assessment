import {Router} from 'express';
import { createUser, deleteUser, getCurrentUser, getUser, getUsers, updateOneUser } from '../controller/userController';
import {loginUser } from '../controller/authController';
import { authenticateuser } from '../utility/middleware';
const router = Router();

router.get("/", authenticateuser,getUsers)
router.get("/current",authenticateuser,getCurrentUser)
router.get("/:id",getUser)
router.post("/register",createUser)
router.post("/login",loginUser)
router.put("/update/:id",updateOneUser)
router.delete("/:id",deleteUser)



export default router;
