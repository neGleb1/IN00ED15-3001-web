import {auth} from '../helper/auth.js';
import {emptyOrRows} from '../helper/utils.js'
import {selectAllTasks, insertTask, deleteTask} from '../models/ModelTask.js';
import {Router} from "express";

const todoRouter = Router();

todoRouter.get('/', async (req, res, next) => {
    try {
        const result = await selectAllTasks();
        return res.status(200).json(emptyOrRows(result));
    } catch (err) {
    return next(err);
    }
});

todoRouter.post('/create', auth, async (req, res, next) => {
    try {
        if(!req.body.description || req.body.description.length === 0){
            const error = new Error("Invalid description for a task")
            error.statusCode = 400
            return next(error)
        }
        const result = await insertTask(req.body.description);
        return res.status(200).json(result.rows[0]);
    } catch (err) {
    return next(err);
    }
});

todoRouter.delete('/delete/:id', auth, async (req, res, next) => {
    try {
        if(!parseInt(req.params.id)){
            const error = new Error('Task id is not provided')
            error.statusCode = 400
            return next(error)
        }
        const result = await deleteTask(parseInt(req.params.id));
        // return res.status(200).json(result);
        return res.status(200).json({id: req.params.id});
    } catch (err) {
    return next(err);
    }
});

export {todoRouter};