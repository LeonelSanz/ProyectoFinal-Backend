import jwt from 'jsonwebtoken';
import { cartsService, usersService } from '../dao/index.js';
import { createHash } from '../services/auth.js';
import config from '../config/config.js';
import UserDTO from '../dao/DTO/UserDTO.js';
import { logger } from '../services/logger.js';

const register = async(req,res)=>{
    try {
        const file = req.file;
        if(!file)
            return res
                .status(500)
                .send({status: "error", error: "Error loading file"});
        const {first_name, last_name, email, password} = req.body;
        if(!first_name || !last_name || !email || !password)
            return res
                .status(400)
                .send({status: "error", error: "Incomplete values"});
        const exists = await usersService.getUserBy({email});
        if(exists)
            return res
                .status(400)
                .send({status: "error", error: "User already exists"});
        const hashedPassword = await createHash(password);
        //const cart = await cartsService.createCart();

        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword,
            //cart: cart._id,
            avatar:`${req.protocol}://${req.hostname}:${process.env.PORT}/img/${file.filename}`
        };
        const result = await usersService.createUser(user);

        const userDB = await usersService.getUserBy({email: user.email});
        const cart = await cartsService.createCart(userDB._id);

        user.cart = cart._id;
        await usersService.updateUser(userDB._id, user);

        res.send({status: "success", message: "User registered"});

    } catch (error) {
        logger.error(error);
        res.status(500).send({status: "error", error: "Server error"});
    }
}

const login = async(req,res)=>{
    try{
        const userToken = UserDTO.getTokenDTO(req.user);
        const token = jwt.sign(userToken, config.jwt.SECRET, {expiresIn:"1d"});
        res.cookie(config.jwt.COOKIE, token).send({
            status: "success",
            message: "logged in"
        });
    } catch(error){
        logger.error(error);
        res.status(500).send({status: "error", error: "Server error"});
    }
}

const loginFail = (req,res)=>{
    logger.error("Login failed");
    res.send("Something went wrong");
}

export default {
    login,
    loginFail,
    register
};