const express = require('express');
const jwt = require('jsonwebtoken');
const Model = require('../models/model');
const router = express.Router();
const bearerTokenTimeout = process.env.BEARER_TOKEN_TIMEOUT || '30s';

// Get all Method
router.get('/get', async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get by ID Method
router.get('/get/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Post Method
router.post('/post', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403).json({message: 'Unauthorized'})
        } else {
            const data = new Model({
                name: req.body.name,
                age: req.body.age
            })
            try {
                const dataToSave = await data.save();
                res.status(200).json(dataToSave)
            } catch (error) {
                res.status(400).json({message: error.message})
            }
        }
    })
})

// Update by ID Method
router.patch('/update/:id', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403).json({message: 'Unauthorized'})
        } else {
            try {
                const id = req.params.id;
                const updatedData = req.body;
                const options = { new: true };

                const result = await Model.findByIdAndUpdate(
                    id, updatedData, options
                )
                res.send(result)
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
                res.send(`Document with ${data.name} has been deleted..`)
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