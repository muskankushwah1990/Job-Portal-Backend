const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const checkUserAuth = async (req, res, next) => {
    const { token } = req.cookies; // Extract token from cookies

    // Check if token exists
    if (!token) {
        return res.status(401).json({ status: "failed", message: "Unauthorized User: No token provided" });
    }

    try {
        // Verify the JWT with the secret key
        const data = jwt.verify(token, "HF5XJowO_L21gOejLPjOORKI_ts");
        
        // Find the user using the ID from the token
        const userdata = await UserModel.findOne({ _id: data.ID });

        if (!userdata) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        // Attach the user data to the request object
        req.userdata = userdata;

        // Proceed to the next middleware or route handler
        next();

    } catch (error) {
        // Handle errors from JWT verification
        return res.status(401).json({ status: "failed", message: "Invalid token or token expired", error: error.message });
    }
};

module.exports = checkUserAuth;
