import { cartsService, historiesService, usersService, productsService } from "../dao/index.js";
import config from "../config/config.js";

const home = async(req,res) => {
    const page = req.query.page||1;
    const pagination = await productsService.getProducts({},page);
    let products = pagination.docs;
    const paginationData = {
        hasPrevPage:pagination.hasPrevPage,
        hasNextPage:pagination.hasNextPage,
        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        page: pagination.page
    }
    res.render('home', {
        products, 
        paginationData, 
        user: req.user, 
        title: "Home"
    });
};

const register = (req,res) => {
    res.render('register', {
        title: "Register"
    });
};

const login = (req,res) => {
    res.render('login', {
        title: "Log In"
    });
};

const profile = async(req,res) => {
    const history = await historiesService.getHistoryBy({
        user :req.user._id
    })
    res.render('profile',{
        user: req.user, 
        events: history ? history.events:[], 
        title: "Profile"
    })
};

const create = (req,res)=>{
    res.render('create');
};

const cart = async(req,res) => {
    const cartId = req.user.cart
    const cart = await cartsService.getCartById(cartId, {populate:true});
    //console.log(cart.products);
    const products = cart.products.map((product) => ({
        ...product._id,
        quantify: product.quantify++
    }));
    const totalPrice = products.reduce((acum, product) => acum + product.price * product.quantify, 0)
    res.render('cart', {
        products,
        user: req.user,
        totalPrice,
        title: "Cart"
    })
};

const buyPage = async(req,res) => {
    const user = await usersService.getUserBy({_id: req.user.id});
    res.render("buy", {user});
};

const logout = (req,res) => {
    res.clearCookie(config.jwt.COOKIE)
    res.render('logout', {
        user: req.user, 
        title: "Log out - Pandora"
    })
};

export default {
    cart,
    create,
    home,
    login,
    profile,
    register,
    buyPage,
    logout
};