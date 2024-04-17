import express  from 'express';
import ApiController from '../controllers/apiController';
let router = express.Router();

const initAPIRoutes = (app) => {
    router.get('/', homeControlle);

    return app.use('/api/v1', router);
}