import userService from '../services/userService';

const handleLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(500)
      .json({ errCode: 1, message: 'Missing inputs parameter!' });
  }

  let userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

const handleGetAllUsers = async (req, res) => {
  let id = req.body.id; //ALL, id
  if (!id) {
    return res
      .status(200)
      .json({
        errCode: 1,
        errMessage: 'Missing required parameters',
        users: [],
      });
  }
  let users = await userService.getAllUsers(id);

  return res.status(200).json({ errCode: 0, errMessage: 'OK', users: users });
};

module.exports = { handleLogin, handleGetAllUsers };
