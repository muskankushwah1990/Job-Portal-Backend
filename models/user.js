const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        confirmpassword: {
            type: String,
            require: true
        },
        phone: {
            type: Number,
            require: true
        },
        image: {
            public_id: {
              type: String,
              require: true,
            },
            url: {
              type: String,
              require: true,
            },
          },
        role: {
           type: String,
           default: "student"
        }
}
, {timestamps: true});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;