const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).send({
        status: "error",
        message: "Access denied. Admins only.",
      });
    }
    next();
  };
  
  module.exports = isAdmin;
  