const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const role = req.user.role;
    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

module.exports = { allowRoles };
