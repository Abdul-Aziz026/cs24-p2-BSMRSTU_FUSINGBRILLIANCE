const isStytemAdmin = (req, res, next)=>{
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }
    if (req.session.user.role != 1) {
        return res.redirect("/auth/login");
    }
    next();
}
module.exports = isStytemAdmin;