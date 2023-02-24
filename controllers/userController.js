require("dotenv").config()
const User = require("../models/UserModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("All fields are required")
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPasswords = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPasswords,
        role: "user",
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            role: user.role,
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
        res.status(400)
        throw new Error("Invalid Email")
    }

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            role: user.role,
        })
    } else {
        res.status(400)
        throw new Error("Invalid Password")
    }
})

const getUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    res.status(200).json(user)
})

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.aggregate([
        {
            $lookup: {
                from: "ads",
                localField: "_id",
                foreignField: "user",
                as: "ads",
            },
        },
        {
            $match: { role: "user" },
        },
        {
            $unset: [
                "password",
                "createdAt",
                "updatedAt",
                "ads.createdAt",
                "ads.updatedAt",
                "ads.__v",
                "__v",
            ],
        },
    ])

    res.status(200).json(users)
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    })
}

module.exports = {
    registerUser,
    loginUser,
    getUser,
    getUsers,
    getUserById,
}