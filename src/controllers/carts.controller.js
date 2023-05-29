import config from "../config/config.js";
import { cartsService, historiesService, ticketsService, usersService } from "../dao/index.js";
import { makeid } from "../utils.js";
import { DateTime } from "luxon";
import { transporter } from "../services/mailer.js";

const insertToCart = async(req,res)=>{
    const user = req.user;
    const productId = req.params.pid;
    const cart = await cartsService.getCartById(user.cart);
    //Corroboro si el producto ya existía en el carrito
    const exists = cart.products.find(
        product => product._id.toString() === productId
    );
    if(exists) {
        cart.products[exists] = {
            ...exists,
            qty: exists.qty++
        };
        await cartsService.updateCart(cart._id, { products: cart.products});
        res.redirect("/cart");
    } else {
        cart.products.push({ _id: productId });
        await cartsService.updateCart(cart._id, { products: cart.products});
        res.redirect("/cart");
    };
};

const deleteCart = async(req,res) => {
    try{
        const user = req.user
        const product = req.params.pro;
        const cart = await cartsService.getCartById(user.cart)

        await cartsService.deleteCart({_id: product});
        cart.products.splice({_id: product})
        await cartsService.updateCart(cart._id, {products: cart.products})
        console.log(cart.products);
        return res.redirect('/cart')
    }catch(error){
        return res.status(404).json({
            error: `ERROR AL ELIMINAR CARRITO POR ID ${error}`
        });
    }
}

const deleteProductById = async (req,res)=>{
    try{
        const user = req.user
        const product = req.params.pro;
        const cart = await cartsService.getCartById(user.cart)
        const exists = cart.products.find(product=>product._id.toString()===product);

        await cartsService.deleteProductById({_id: product});
        cart.products.splice(exists, 1)
        await cartsService.updateCart(cart._id, {products: cart.products})
        console.log(cart.products);
        return res.redirect('/cart')
    }catch(error){
        console.log("Error deleting the product:", error);
        return res.status(404).json({
            error: `Error deleting the product ${error}`
        });
    }
};

const purchase = async(req,res) =>{
    const user = await usersService.getUserBy({ _id: req.user.id });
    const cart = await cartsService.getCartById( user.cart );
    const populatedCart = await cartsService.getCartById(user.cart, {populate:true});

    const total = populatedCart.products.reduce(
        (acum, product) => acum + product._id.price * product.qty,
        0
    );

    const ticket = {
        user: user._id,
        products: cart.products,
        total: total,
        code: makeid(20)
    };

    await cartsService.updateCart(populatedCart._id, {products: []});
    await ticketsService.createTicket(ticket);

    const history = await historiesService.getHistoryBy({user: user._id});
    const event = {
        event:'Purchase',
        date: DateTime.now().toISO(),
        description:`Made a purchase of 
            ${cart.products.length > 1
                ? "multiple products"
                : "one product"
            }`
    }
    
    if(!history){
        await historiesService.createHistory({
            user: user._id,
            events: [event]
        });
    } else{
        history.events.push(event);
        await historiesService.updateHistory(history._id, {
            events: history.events
        })
    }

    let order = '';
    for(const product of cart.products){
        order += `<div> <h2>${product._id.title}</h2> <h4>Price: $ ${product._id.price}</h4> <h4>Quantity: ${product.qty}</h4> </div>` 
    };

    const result = await transporter.sendMail({
        from: `<${config.mailer.GMAIL_USER}>`,
        to: [config.mailer.GMAIL_USER, user.email],
        subject: `Order by ${user.first_name} ${user.last_name}`,
        html: `
        <div>
            <h1>Order: </h1>
            <p>Date: ${DateTime.now().toISO()}</p>
            <p>Code: <strong> ${ticket.code} </strong></p>
            <hr>
            <div>
                ${order}
            </div>
            <hr>
            <h3> Total: $${total} </h3>
        </div>
        `
    });
    res.redirect("/buy");
};

export default {
    insertToCart,
    deleteCart,
    deleteProductById,
    purchase
};