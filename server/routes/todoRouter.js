import {pool} from '../db.js';
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
        return typeof(id) !== "string" ? res.rows[0] : {error: "id is NaN"};
    } catch (err) {
        console.error(err);
        return {error: err};
    }
}

todoRouter.get('/', async (req, res, next) => {
    try {
        const result = await getTasks();
        res.status(200).json(result);
    } catch (err) {
    //   res.status(500).json({ error: err.message || err.toString() });
    return next(err);
    }
});

todoRouter.post('/create', async (req, res) => {
    try {
        const result = await insert(req.body.description);
        res.status(200).json(result);
    } catch (err) {
    //   res.status(500).json({ error: err.message || err.toString() });
    return next(err);
    }
});

todoRouter.delete('/delete/:id', async (req, res) => {
    try {
        const result = await deleteTask(parseInt(req.params.id));
        res.status(200).json({id: req.params.id});
    } catch (err) {
    //   res.status(500).json({ error: err.message || err.toString() });
    return next(err);
    }
});

export {todoRouter};