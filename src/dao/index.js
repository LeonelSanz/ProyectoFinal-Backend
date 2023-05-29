import UserDao from './mongo/UserDAO.js';
import ProductsDao from './mongo/ProductsDAO.js';
import CartsDao from './mongo/CartsDAO.js';
import TicketsDAO from './mongo/TicketsDAO.js';
import HistoriesDAO from './mongo/HistoriesDAO.js';

export const usersService = new UserDao();
export const productsService = new ProductsDao();
export const cartsService = new CartsDao();
export const ticketsService = new TicketsDAO();
export const historiesService = new HistoriesDAO();