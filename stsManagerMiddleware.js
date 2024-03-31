const isStsManager = (req, res, next)=>{
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }
    if (req.session.user.role != 2) {
        return res.redirect("/auth/login");
    }
    next();
}
module.exports = isStsManager;