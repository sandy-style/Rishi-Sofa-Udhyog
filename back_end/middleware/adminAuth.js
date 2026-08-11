import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Only admin can logIn" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (
      tokenDecode !==
      process.env.ADMIN_USERNAME + process.env.ADMIN_PASSWORD
    ) {
      return res.json({ success: false, message: "You are not admin" });
    }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredErro") {
      return res.json({
        success: false,
        message: "Session expired. Please LogIn again.",
      });
    }
    return res.json({ success: false, message: error.message });
  }
};
export default adminAuth;
