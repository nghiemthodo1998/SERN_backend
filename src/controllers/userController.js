import userService from "../services/userService";
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ errCode: 1, message: "Missing inputs parameter!" });
  }

  try {
    let userData = await userService.handleUserLogin(email, password);

    if (userData.errCode === 0) {
      const token = await jwt.sign(
        { userLogin: userData.user },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.cookie("access_token", token, {
        maxAge: 365 * 24 * 60 * 60 * 100,
        httpOnly: true,
        // secure: true;
      });
      return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user: userData.user,
      });
    } else {
      return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user: {},
      });
    }
  } catch (error) {
    return res.status(500).json({
      errCode: 500,
      message: "Đã xảy ra lỗi trong quá trình xử lý.",
      user: {},
    });
  }
};

const handleLogout = async (req, res) => {
  let userData = await userService.handleUserLogout();
  res.clearCookie("access_token"); // Xóa cookie có tên "access_token"

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.message,
    user: userData.user,
  });
};

const handleGetAllUsers = async (req, res) => {
  let { id } = req.query; //ALL, id
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({
      errCode: 401,
      message: "Unauthorized",
      users: [],
    });
  }
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters",
      users: [],
    });
  }
  try {
    // Giải mã token và kiểm tra tính hợp lệ
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    let users = await userService.getAllUsers(id);

    return res.status(200).json({ errCode: 0, message: "OK", users: users });
  } catch (error) {
    return res.status(401).json({
      errCode: 401,
      message: "Unauthorized",
      users: [],
    });
  }
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
      message: "Missing required parameters!!!",
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

const handleGetAllCode = async (req, res) => {
  const typeInput = req.query.type;
  try {
    let data = await userService.getAllCode(typeInput);
    return res.status(200).json(data);
  } catch (error) {
    res.status(200).json({ errCode: -1, message: "Error from server" });
  }
};

module.exports = {
  handleLogin,
  handleGetAllUsers,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  handleLogout,
  handleGetAllCode,
};
