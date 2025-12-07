import express from 'express';
import { getNowPlayingMovies } from '../controllers/showController.js';

// All routes which include the /show

const showRouter = express.Router();

showRouter.get('/now-playing',getNowPlayingMovies);


export default showRouter;