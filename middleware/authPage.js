const authPage = (roles) => {
  return (req, res, next) => {
    let isPass = false;
    const loginRole = req.session.user.role;
    console.log("#1 login role", loginRole);
    for (let i = 0; i < roles.length; i++) {
      if (roles[i] === loginRole) {
        isPass = true;
      }
    }
    if (isPass) {
      return next();
    } else {
      return res.status(401).json({ message: "You dont have permission!!" });
    }
  };
};

module.exports = authPage;
