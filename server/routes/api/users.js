const router = require('express').Router();
let User = require('../../models/User.model');

router.route('/').get(async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user ? res.json(user) : res.status(400).json('Error: user not found');
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
});

router.route('/add').post(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  const newUser = new User({
    fullName,
    username,
    email,
    password,
  });

  // TODO: Password hashing

  try {
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).json(`Error ${err}`);
  }
});

router.route('/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/update/:id').post(async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findById(req.params.id);
    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
});

module.exports = router;
