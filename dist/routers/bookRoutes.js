import { Router } from 'express';
import BookController from '../controllers/BookController';
import Authenticated from '../middlewares/Authenticated';
const router = Router();
router
    .get('/books', BookController.listBooks)
    .get('/book/:id', BookController.listBookById)
    .post('/book', Authenticated.verifyAuthenticated, BookController.createBook)
    .put('/book/:id', Authenticated.verifyAuthenticated, BookController.editBook)
    .patch('/book/read/:id', Authenticated.verifyAuthenticated, BookController.readBook)
    .patch('/book/change/:id', Authenticated.verifyAuthenticated, BookController.changeBook)
    .delete('/book/:id', Authenticated.verifyAuthenticated, BookController.deleteBook);
export default router;
//# sourceMappingURL=bookRoutes.js.map