import {pool} from '../helper/db.js';
import {auth} from '../helper/auth.js';
import {Router} from "express";

const todoRouter = Router();

const getTasks = async () => {
    try {
        const res = await pool.query('select * from task');
        return res.rows;
    } catch (err) {
        console.error(err);
    }
}

const insert = async (description) => {
    try {
        const res = await pool.query('insert into task (description) values ($1) returning *', [description]);
        return res.rows[0];
    } catch (err) {
        console.error(err);
        return {error: err};
    }
}

const deleteTask = async (id) => {
    try {        
        const res = await pool.query('delete from task where id = $1', [id]);
        return res.rows[0];
    } catch (err) {
        console.error(err);
        return {error: err};
    }
}

todoRouter.get('/', async (req, res, next) => {
    try {
        const result = await getTasks();
        return res.status(200).json(result);
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
        const result = await insert(req.body.description);
        return res.status(200).json(result);
    } catch (err) {
    return next(err);
    }
});

todoRouter.delete('/delete/:id', auth, async (req, res, next) => {
    try {
        if(!req.params.id){
            const error = new Error('Task id is not provided')
            error.statusCode = 400
            return next(error)
        }
        const result = await deleteTask(parseInt(req.params.id));
        return res.status(200).json({id: req.params.id});
    } catch (err) {
    return next(err);
    }
});

export {todoRouter};