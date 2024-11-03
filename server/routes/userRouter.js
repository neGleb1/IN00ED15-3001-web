import {pool} from '../helper/db.js';
import {Router} from 'express';
import {hash, compare} from 'bcrypt';
import jwt from 'jsonwebtoken';
const {sign} = jwt;

const userRouter = Router();

const insert = async (email, password) => {
    try {
        const res = await pool.query('insert into account (email, password) values ($1, $2) returning *', [email, password]);
        return res.rows[0];
    } catch (err) {
        console.error(err);
        return {error: err};
    }
}

const getByEmail = async (email) => {
    try {
        const res = await pool.query('select * from account where email = $1', [email]);
        return res;
    } catch (err) {
        console.error(err);
        return {error: err};
    }
}

userRouter.post('/login', async (req, res, next) => {
    const invalid_message = 'Invalid credentials.';
    try {
        const result = await getByEmail(req.body.email);

        if (result.rowCount === 0) return next(new Error(invalid_message));

        // https://www.npmjs.com/package/bcrypt#with-promises
        const match = await compare(req.body.password, result.rows[0].password);

        if (!match) return next(new Error(invalid_message));

        const token = sign({user: req.body.email}, process.env.JWT_SECRET_KEY);
        const user = result.rows[0];
        return res.status(200).json({ id: user.id, email: user.email, token: token });
    } catch (err) {
        return next(err);
    }
});

userRouter.post('/register', async (req, res, next) => {
    try {
        // https://www.npmjs.com/package/bcrypt#with-promises
        const hashedPassword = await hash(req.body.password, 10);
        const result = await insert(req.body.email, hashedPassword);
        res.status(201).json({ id: result.id, email: result.email });
    } catch (err) {
        return next(err);
    }
});

export {userRouter};