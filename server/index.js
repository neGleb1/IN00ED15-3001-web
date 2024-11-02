import express from 'express';
import cors from 'cors';
import pg from 'pg';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const { Pool } = pg;
const pool = new Pool({
    host: 'localhost',
    database: 'todo',
    port: 5435,
    user: 'admin',
    password: '87654321'
});

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

app.get('/', async (req, res) => {
    try {
        const result = await getTasks();
        res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message || err.toString() });
    }
});

app.post('/create', async (req, res) => {
    try {
        const result = await insert(req.body.description);
        res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message || err.toString() });
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        const result = await deleteTask(parseInt(req.params.id));
        res.status(200).json({id: req.params.id});
    } catch (err) {
      res.status(500).json({ error: err.message || err.toString() });
    }
});

const port = 3001;
app.listen(port);