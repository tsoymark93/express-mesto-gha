const router = require('express').Router();

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validationCreateCard, validationCardById } = require('../middlewares/validation');

router.get('/cards', getCards);
router.post('/cards', validationCreateCard, createCard);
router.delete('/cards/:cardId', validationCardById, deleteCard);
router.put('/cards/:cardId/likes', validationCardById, likeCard);
router.delete('/cards/:cardId/likes', validationCardById, dislikeCard);

module.exports = router;
