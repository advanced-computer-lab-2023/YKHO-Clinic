const jwt = require('jsonwebtoken');

const requireAuthDoctor = (req, res, next) => {
  const token = req.cookies.jwt;
    
  // check json web token exists & is verified
  if (token) {  
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        // console.log('You are not logged in.');
        // res send status 401 you are not logged in
        res.status(401).json({message:"You are not logged in."})
        // res.redirect('/login');
      } else {
        if(decodedToken.user.type!="doctor"){
          res.status(401).json({message:"You are not logged in."})
        }
        else{
          req.user=decodedToken.user;
          next();
        }
      }
    });
  } else {
    res.status(401).json({message:"You are not logged in."})
  }
}
const requireAuthPatient = (req, res, next) => {
  const token = req.cookies.jwt;
    
  // check json web token exists & is verified
  if (token) {  
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        // console.log('You are not logged in.');
        // res send status 401 you are not logged in
        res.status(401).json({message:"You are not logged in."})
        // res.redirect('/login');
      } else {
        if(decodedToken.user.type!="patient"){
          res.status(401).json({message:"You are not logged in."})
        }
        else{
          req.user=decodedToken.user;
          next();
        }
      }
    });
  } else {
    res.status(401).json({message:"You are not logged in."})
  }
}
const requireAuthAdmin = (req, res, next) => {
  const token = req.cookies.jwt;
    
  // check json web token exists & is verified
  if (token) {  
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        // console.log('You are not logged in.');
        // res send status 401 you are not logged in
        res.status(401).json({message:"You are not logged in."})
        // res.redirect('/login');
      } else {
        if(decodedToken.user.type!="admin"){
          res.status(401).json({message:"You are not logged in."})
        }
        else{
          req.user=decodedToken.user;
          next();
        }
      }
    });
  } else {
    res.status(401).json({message:"You are not logged in."})
  }
}
const requireAuth=(req,res,next)=>{
  const token = req.cookies.jwt;
  console.log("test3")
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        console.log("test2")
        // res send status 401 you are not logged in
        res.status(401).json({message:"You are not logged in."})
        // res.redirect('/login');
      } else {
          req.user=decodedToken.user;
          next();
      }
    });
  } else {
    console.log("test")
    res.status(401).json({message:"You are not logged in."})
  }
}


module.exports = { requireAuthDoctor,requireAuthPatient,requireAuthAdmin,requireAuth };
