const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const userAuth = async (req, res, next) => {
  console.log(req.headers);
  if (!req.headers["authorization"])
    return res.status(401).send("Unauthorized");

  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");

  const token = bearerToken[1];

  try {
    const decodedObj = await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      (err, decodedObj) => {
        if (err?.name === "TokenExpiredError") {
          return res.status(401).send("Token expired");
        }
        if (err) {
          return res.status(401).send("Invalid token" + err.message);
        }

        return decodedObj;
      }
    );
    const userId = decodedObj?._id;
    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User Not Found");
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).send("Error authenticating user: " + err);
  }
};

module.exports = { userAuth };
