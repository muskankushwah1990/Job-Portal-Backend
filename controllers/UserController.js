const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  // secure: true
});

class UserController {
  static getUser = async (req, res) => {
    try {
      const { id } = req.userdata;
      // console.log("id", id)
      const data = await UserModel.findById(id);
      // console.log("getuser", data)
      res.status(206).json(data);
    } catch (error) {
      console.log(error);
      res.status(400).json({ status: "failed", message: error.message });
    }
  };

  static registerUser = async (req, res) => {
    try {
      const { name, email, password, phone, role, confirmpassword } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (user) {
        res
          .status(401)
          .json({ status: "failed", message: "Email already exists" });
      } else {
        if (name && email && password && role && phone && confirmpassword) {
          if (password === confirmpassword) {
            // console.log(req.files.image)
            const file = req.files.image;
            const imageUpload = await cloudinary.uploader.upload(
              file.tempFilePath,
              { folder: "JobPortal" }
            );
            const hashpassword = await bcrypt.hash(String(password), 18);
            const result = new UserModel({
              name: name,
              email: email,
              password: hashpassword,
              role: role,
              phone: phone,
              image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url,
              },
            });
            await result.save();

            //generate token

            const token = jwt.sign(
              {
                userId: result._id,
                email: result.email,
              },
              "HF5XJowO_L21gOejLPjOORKI_ts"
            );

            res.status(201).cookie("token", token).json({
              status: "success",
              message: "Registration successfully!",
              token: token,
            });
          } else {
            res.status(401).json({
              status: "failed",
              message: "Password and confirm password is incorrect",
            });
          }
        } else {
          res.status(401).json({
            status: "failed",
            message: "all fields are required",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "Internal server error",
      });
    }
  };

  static updateProfile = async (req, res) => {
    try {
      const { id } = req.userdata;
      const { name, email } = req.body;

      if (req.files && req.files.image) {
        const imageFile = req.files.image;

        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        // console.log("imageID", imageID)

        // deleting image from cloudinary
        await cloudinary.uploader.destroy(imageID);

        // new image upload
        const uploadImage = await cloudinary.uploader.upload(
          imageFile.tempFilePath,
          {
            folder: "userProfile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: uploadImage.public_id,
            url: uploadImage.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }

      const profileUpdate = await UserModel.findByIdAndUpdate(id, data);
      res.status(200).json({
        status: "success",
        message: "Profile update successfully!",
        profileUpdate,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while updating the profile.",
      });
    }
  };

  static changePassword = async (req, res) => {
    try {
      const { id } = req.userdata;
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatch = await bcrypt.compare(op, user.password);
        if (!isMatch) {
          res
            .status(401)
            .json({ status: "failed", message: "Old password is incorrect!" });
        } else {
          if (np != cp) {
            res.status(401).json({
              status: "failed",
              message: "New Password and Confirm Password doesn't match!",
            });
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            const newPassword = await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            // console.log("newPassword", newPassword)
            res.status(200).json({
              status: "success",
              message: "Password updated successfully!",
              newPassword,
            });
          }
        }
      } else {
        res
          .status(401)
          .json({ status: "failed", message: "All fields are required!" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  static login = async (req, res) => {
    try {
      //console.log(req.body)
      const { email, password, role } = req.body;
      if (email && password && role) {
        const user = await UserModel.findOne({ email: email });

        if (user != null) {
          const isMatched = await bcrypt.compare(
            String(password),
            String(user.password)
          );
          if (isMatched) {
            if (user.role === role) {
              const token = jwt.sign(
                { ID: user._id },
                "HF5XJowO_L21gOejLPjOORKI_ts"
              );
              //console.log(token);
              res.cookie("token", token);
              res
                .status(201)
                .json({
                  status: "success",
                  message: "Login OK Report",
                  token: token,
                  user,
                });
            } else {
              res
                .status(401)
                .json({
                  status: "failed",
                  message: "User with this role not found",
                });
            }
          } else {
            res
              .status(402)
              .json({
                status: "failed",
                message: "Email or password are not found",
              });
          }
        } else {
          res
            .status(401)
            .json({ status: "failed", message: "you are not a register user" });
        }
      } else {
        res
          .status(401)
          .json({ status: "failed", message: "all fields are required" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  static logout = async (req, res) => {
    try {
      res
        .status(201)
        .cookie("token", "HF5XJowO_L21gOejLPjOORKI_ts", {
          httpOnly: true,
          expire: new Date(Date.now()),
        })
        .json({
          success: true,
          message: "Logout Successfully",
        });
    } catch (error) {
      console.log(error);
      res.status(490).json({ status: "failed", message: error.message });
    }
  };
}

module.exports = UserController;
