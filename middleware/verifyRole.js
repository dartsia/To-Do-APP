const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user?.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.sendStatus(403);
      }
      next();
    };
  };
  
  module.exports = verifyRole;