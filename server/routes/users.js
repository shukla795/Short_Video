const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");


var nodemailer = require('nodemailer');

 process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



    var transporter = nodemailer.createTransport({
      service : 'Gmail',
      auth:{
        user:'hs418577@gmail.com',
        pass:'shukla@123'
      }
    });

    // var transporter = nodemailer.createTransport(smtpTransport({
    //     host: "gmail", // hostname
    //     secure: false, // use SSL
    //     port: 25, // port for secure SMTP
    //     auth: {
    //         user: "hs418577@gmail.com",
    //         pass: "shukla@123"
    //     },
    //     tls: {
    //         rejectUnauthorized: false
    //     }
    // }));
    

      


//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        
        let term = req.body.email
        // console.log(req.body.email);
        // console.log($term);
    //    var email : email;   
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);


               
                var mailOptions = {
                    from:'hs418577@gmail.com',
                    to: req.body.email,
                    subject : 'HAPPY YOUTUBE',
                    text : 'Welcome to my ninja technique' +  
                               'This mail From Video Hosting Platform'
                  };
                  
                  
                  transporter.sendMail(mailOptions , function(error,info){
                    if(error){
                      console.log(error);
                    }else{
                      console.log('success'); 
                      console.log('Email Sent :' + info.response);
                      }
                  });
               




                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                       loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

module.exports = router;
