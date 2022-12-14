const express = require('express');
const jwt = require('jsonwebtoken');
const Model = require('../models/model');
const router = express.Router();
const bearerTokenTimeout = process.env.BEARER_TOKEN_TIMEOUT || '30s';
const { body, validationResult } = require('express-validator');

// Get all Method
router.get('/get', async (req, res) => {
    try {
        const data = await Model.find();

        // Filter unnecessary fields from the response
        const mapped = data.map(({id, name, email, age}) => ({id, name, email, age}));
        res.status(200).send(mapped)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get by ID Method
router.get('/get/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.status(200).send({
            id: data.id,
            name: data.name,
            email: data.email,
            age: data.age
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Post Method
router.post('/post', verifyToken, body('email').isEmail(), async (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403).json({message: 'Unauthorized'})
        } else {
            // Finds the validation errors in this request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'You must provide a valid email address'});
            }

            const records = new Model({
                name: req.body.name,
                email: req.body.email,
                age: req.body.age
            })
            try {
                const data = await records.save();
                res.status(200).send({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    age: data.age
                })
            } catch (error) {
                res.status(400).json({message: error.message})
            }
        }
    })
})

// Update by ID Method
router.patch('/update/:id', verifyToken, body('email').isEmail(), async (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403).json({message: 'Unauthorized'})
        } else {
            // Finds the validation errors in this request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'You must provide a valid email address'});
            }

            try {
                const id = req.params.id;
                const updatedData = req.body;
                const options = { new: true };

                const data = await Model.findByIdAndUpdate(
                    id, updatedData, options
                )
                res.status(200).send({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    age: data.age
                })
            }
            catch (error) {
                res.status(500).json({ message: error.message })
            }
        }
    })
})

// Delete by ID Method
router.delete('/delete/:id', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403).json({message: 'Unauthorized'})
        } else {
            try {
                const id = req.params.id;
                const data = await Model.findByIdAndDelete(id)

                res.status(200).json({ message: `The user ${data.name} has been removed` })
            }
            catch (error) {
                res.status(400).json({ message: error.message })
            }
        }
    })
})

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Get JWT Token
router.get('/token', async (req, res) => {
    // Mock user
    const user = {
        id: 1,
        username: 'auth',
        email: 'auth@demo.api'
    }

    jwt.sign({user}, 'secretkey', { expiresIn: bearerTokenTimeout }, (err, token) => {
        res.json({
            token
        })
    })
})

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.status(403).json({ message: 'Unauthorized' })
    }
}

module.exports = router;