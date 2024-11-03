import { expect } from "chai";
import {initializeTestDb, insertTestUser, getToken} from './helper/test.js';

const url = 'http://localhost:3001/';

describe('GET Tasks', () => {

    // I USED DOCKER WITH SQL SCRIPTS ON INIT. SCRIPTS ARE IN db AND test_db FOLDERS
    // before(() => {
    //     initializeTestDb();
    // });

    it('should get all tasks', async () =>{
        const response = await fetch(url);
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id', 'description');
    });
});

describe('POST task', () => {
    const email = 'task@gmail.com';
    const password = 'task123';
    insertTestUser(email, password);
    const token = getToken(email);
    it('should post a task', async () =>{
        const response = await fetch(url + 'create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ 'description': 'Task from unit test' })
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id');
    });

    it('should not post a task without description', async () =>{
        const response = await fetch(url + 'create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({'description':null})
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('error');
    });
});

describe('DELETE task', () => {

    const email = 'task@gmail.com';
    const token = getToken(email);

    it('should delete a task', async () =>{
        const response = await fetch(url + 'delete/1', {
            method: 'delete',
            headers: {
                'Authorization': token
            }
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id');
    });

    it('should not delete a task with SQL injection', async () =>{
        const response = await fetch(url + 'delete/id=0 or id > 0', {
            method: 'delete',
            headers: {
                'Authorization': token
            }
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id');
    });
});

describe('POST register', () => {

    const email = 'register@gmail.com';
    const password = 'register123';

    it('should register with valid email and password', async () =>{
        const response = await fetch(url + 'user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        });
        const data = await response.json();

        expect(response.status).to.equal(201, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email');
    });
});

describe('POST login', () => {

    const email = 'register@gmail.com';
    const password = 'register123';
    insertTestUser(email, password);
    it('should register with valid email and password', async () =>{
        const response = await fetch(url + 'user/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        });
        const data = await response.json();

        expect(response.status).to.equal(200, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email', 'token');
    });
});