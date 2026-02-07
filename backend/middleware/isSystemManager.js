module.exports = (req, res, next) => {
  if (req.user.role !== "system_manager") {
    return res.status(403).json({
      message: "Only System Manager can perform this action",
    });
  }
  next();
};
