const router = require('express').Router();

const {
  getUser, getUsers, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');
const { validationUserId, validationUpdateUser, validationUpdateAvatar } = require('../middlewares/validation');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', validationUserId, getUser);
router.patch('/users/me', validationUpdateUser, updateUser);
router.patch('/users/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = router;
