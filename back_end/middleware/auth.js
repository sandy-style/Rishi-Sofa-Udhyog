import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({
      success: false,
      message: "Please log in",
      tokenExpired: false,
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = tokenDecode.id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.json({
        success: false,
        message: "Your session has expired. Please log in again.",
        tokenExpired: true,
      });
    }

    console.log("AUTH ERROR:", error);

    return res.json({
      success: false,
      message: "Invalid authentication token. Please log in again.",
      tokenExpired: false,
    });
  }
};

export default authUser;
