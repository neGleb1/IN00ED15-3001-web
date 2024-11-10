import {auth} from '../helper/auth.js';
import {selectAll, addTask, minusTask} from '../controllers/TaskController.js';
import {Router} from "express";

const todoRouter = Router();

todoRouter.get('/', selectAll);
todoRouter.post('/create', auth, addTask);
todoRouter.delete('/delete/:id', auth, minusTask);

export {todoRouter};