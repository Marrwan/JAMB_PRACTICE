module.exports = {
    isLoggedIn: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'You have to log in to view that');
        res.redirect('back')
    },
    isAdmin : function(req,res,next){
        if(req.isAuthenticated() && req.user.userType == 'admin'){
            return next();
        }
        req.flash('error_msg', 'Sorry, this view is only for the admin');
        res.redirect('back')
    },
    isStudent: function(req,res,next){
        if(req.isAuthenticated() && req.user.userType == 'student' ){
            return next();
        }
        req.flash('error_msg', 'Sorry, this view is only for the students');
        res.redirect('back')
    }
}