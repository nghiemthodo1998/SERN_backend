import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

const handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: ["email", "roleId", "password"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "OK";

            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's not found`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Your's email isn't exist in your system. Plz try other email`;
      }

      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

const checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: email },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllUsers = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

const createNewUser = (data) => {
  const {
    email,
    firstName,
    lastName,
    address,
    phonenumber,
    gender,
    roleId,
    positionId,
  } = data;
  return new Promise(async (resolve, reject) => {
    try {
      //check email is exist
      let check = await checkUserEmail(email);
      if (check === true) {
        resolve({
          errCode: 1,
          message: "This email is exist!!!",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        console.log("hashPasswordFromBcrypt", hashPasswordFromBcrypt);
        await db.User.create({
          email,
          password: hashPasswordFromBcrypt,
          firstName,
          lastName,
          address,
          phonenumber,
          gender: gender === "1" ? true : false,
          roleId,
          positionId,
        });
        resolve({
          errCode: 0,
          message: "Create a new user success!!!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    let user = await db.User.findOne({
      where: { id: id },
    });
    if (!user) {
      resolve({
        errCode: 2,
        errMessage: `The user isn't exist`,
      });
    } else {
      await db.User.destroy({
        where: { id: id },
      });
      resolve({
        errCode: 0,
        errMessage: "Deleted user success!!!",
      });
    }
  });
};

const updateUserData = (data) => {
  const {
    id,
    email,
    firstName,
    lastName,
    address,
    phonenumber,
    gender,
    roleId,
    positionId,
  } = data;
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({ errCode: 2, errMessage: "Missing required parameters" });
      } else {
        let user = await db.User.findOne({ where: { id: id }, raw: false });
        if (user) {
          user.email = email;
          user.firstName = firstName;
          user.lastName = lastName;
          user.address = address;
          user.phonenumber = phonenumber;
          user.gender = gender;
          user.roleId = roleId;
          user.positionId = positionId;
          await user.save();
          resolve({ errCode: 0, message: "Updated user success!!!" });
        } else {
          resolve({ errCode: 1, message: "User not found" });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin,
  checkUserEmail,
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUserData,
};
