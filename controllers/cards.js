const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const CurrentError = require('../errors/CurrentError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err && err.name && err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }

      if (card.owner.toString() === req.user._id) {
        return Card.deleteOne({ _id: req.params.cardId })
          .then(() => res.send(card));
      }
      throw new CurrentError('Недостаточно прав');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Запрашиваемая карточка не найдена'));
      } else {
        next(err);
      }
    });
};

// eslint-disable-next-line arrow-body-style
const updateCardLikes = (cardId, userId, updateData) => {
  return Card.findByIdAndUpdate(
    cardId,
    updateData,
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      return card;
    });
};

module.exports.likeCard = (req, res, next) => {
  const updateData = { $addToSet: { likes: req.user._id } };
  updateCardLikes(req.params.cardId, req.user._id, updateData)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err && err.name && err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const updateData = { $pull: { likes: req.user._id } };
  updateCardLikes(req.params.cardId, req.user._id, updateData)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err && err.name && err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(err);
      }
    });
};
