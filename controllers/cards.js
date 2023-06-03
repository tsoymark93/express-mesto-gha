const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err && err.name && err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.remove({
          _id: req.params.cardId,
        })
          .then(() => res.sendStatus(200));
      } else { res.status(400).send({ message: 'Запрашиваемая карточка не найдена' }); }
    })
    .catch((err) => {
      if (err && err.name && err.name === 'TypeError') {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).then((card) => {
  if (!card) {
    res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
    return;
  }

  res.send(card);
})
  .catch((err) => {
    if (err && err.name && err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
    } else {
      res.status(500).send({ message: 'Ошибка сервера' });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((card) => {
  if (!card) {
    res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
    return;
  }
  res.send(card);
})
  .catch((err) => {
    if (err && err.name && err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
    } else {
      res.status(500).send({ message: 'Ошибка сервера' });
    }
  });
