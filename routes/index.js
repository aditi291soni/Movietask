var express = require('express');
var router = express.Router();
const userModel=require('./users')
const multer=require("multer")
const passport=require('passport')

const localStrategy = require("passport-local")
passport.use(new localStrategy(userModel.authenticate()));



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,uniqueSuffix + '-' +  file.originalname )
  }
})

const upload = multer({ storage: storage })


router.get('/', function(req, res, next) {
  userModel.find()
  .then((card)=>{
    res.render('index',{card:card});
  })
  
  
  
});
router.get('/createpost',function(req, res, next) {
  res.render('createpost');
});

router.post('/create',upload.single('image'),isLoggedIn, function(req, res, next) {

  userModel.create({
    description:req.body.description,
    heading:req.body.heading,
    image:req.file.filename,
    category:req.body.category
  })
  .then((e)=>{

    res.redirect('/');
  })


});
router.get('/post/:id', function(req, res, next) {
  userModel.findOne({
    _id:req.params.id
  })
  .then((e)=>{
res.render('post',{e})
// res.send(e)
  })
});
router.get('/edit/:id',isLoggedIn, function(req, res, next) {
userModel.findOne({_id:req.params.id})
.then((data)=>{
  // console.log(data);
  res.render('edit',{data});
})

});
router.post('/update/:id',upload.single('image'),isLoggedIn, function(req, res, next) {
  
  userModel.findOneAndUpdate( {_id:req.params.id},{
    description:req.body.description,
    heading:req.body.heading,
    image:req.file.filename,
    category:req.body.category} )
    .then((updated)=>{
      // res.send(updated)
      console.log(updated);
res.redirect('/')
    })

  
  
});
router.get('/delete/:id',isLoggedIn, function(req, res, next) {
  userModel.findOneAndDelete({_id:req.params.id})
  .then((deleteitem)=>{
console.log(deleteitem);
res.redirect("/")
  })
});
router.get('/movie', function(req, res, next) {
res.render("pagenotfound")
});
router.get('/signin', function(req, res, next) {
  res.render("signin")
  });
  



  router.post('/register', function (req, res, next) {
    var newUser = new userModel({
      username: req.body.username,
  
    })
    userModel.register(newUser, req.body.password)
      .then(function (u) {
        passport.authenticate('local')(req, res, function () {
          res.redirect('/signin')
        })
      })
      .catch(function (e) {
        res.send(e)
      })
  });
  
  router.post('/login', passport.authenticate('local',
    {
      successRedirect: '/createpost',
      failureRedirect: '/signin'
    }),
    function (req, res) { });
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    else {
      res.redirect("/signin")
    }
  }
  router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      else{
      res.redirect('/signin');}
    });
  });
  
module.exports = router;
