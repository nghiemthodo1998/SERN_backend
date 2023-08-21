import userService from '../services/userService';

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(200)
      .json({ errCode: 1, message: 'Missing inputs parameter!' });
  }

  let userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.message,
    user: userData.user ? userData.user : {},
  });
};

const handleGetAllUsers = async (req, res) => {
  let { id } = req.query; //ALL, id
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: 'Missing required parameters',
      users: [],
    });
  }
  let users = await userService.getAllUsers(id);

  return res.status(200).json({ errCode: 0, message: 'OK', users: users });
};

const handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
};

const handleDeleteUser = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: 'Missing required parameters!!!',
    });
  }
  let message = await userService.deleteUser(+id);
  return res.status(200).json(message);
};

const handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
};

module.exports = {
  handleLogin,
  handleGetAllUsers,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
};
