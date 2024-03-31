const homeAccess = (req, res, next)=>{
if (!req.session.user) {
return res.redirect("/auth/login");
}
if (req.session.user.role == 4) {
return res.redirect("/auth/login");
}
next();
}
module.exports = homeAccess;