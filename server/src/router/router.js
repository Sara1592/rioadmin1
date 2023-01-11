const express = require("express");
const router = new express.Router();
const nodemailer = require("nodemailer");
const {collegereg} = require('../controllers/auth')
const jwt = require('jsonwebtoken');
const db = require('../db')
const {v4 : uuidv4} = require('uuid')
const repo = require('./repository');
const { application } = require("express");



// send mail
router.post('/colreg',  async(req, res) => {

    const { coll_id,  coll_name, email} = req.body;
   
    const generate_id = uuidv4()   
    
        await db.query('insert into registercol(coll_id, coll_name, email, generate_id, active) values ($1, $2, $3, $4, $5)', [
        coll_id,
        coll_name,
        email,
        generate_id,
        false
      ])
    

    try { 
    const user = await db.query('select * from registercol where email=$1 AND active=$2 AND coll_id=$3' , [email, false, coll_id], (error, results) => {
            if (error) {
              throw error
            }
            response.status(200).json(results.rows)
                 })
        
        if(user.rows && user.rows.length){
          const transporter = nodemailer.createTransport({
            service: "gmail", 
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });


        const mailOptions = {
            from: process.env.EMAIL,
            to: email,  
            subject: "Sending Email With RIO",
            text: `You requested for email verification, kindly use this
		http://localhost:3000/verify/${user.rows[0].id}/${user.rows[0].generate_id} to verify your email address`
		
        };
 
       
        transporter.sendMail(mailOptions, async(error, info) => {
            if (error) {
                console.log("Error" + error)
            } else {

                
                console.log("Email sent:");
                res.status(201).json({status:201,info})
            }
        })


        }
            
    } catch (error) {
        console.log("Error" + error);
        res.status(401).json({status:401,error})
    }

    
});

router.get('/verify/:id/:token', async(req,res) => {
    const {id,token} = req.params;
    try{
        const user = await db.query('select * from registercol where id=$1 AND generate_id=$2' , [id,token])
    
        console.log(user)
        if(user.rows.length){
            
           await db.query(
                "UPDATE registercol SET active=$2  WHERE id = $1",
                [id, true]
              );
              res.json({status: 'success', data: {user: {coll_name:user.rows[0].coll_name}}, message: ''})
        }
        

    }
    catch(e)
    {
        res.json({status: 'failure', data: null, message: ''})
    }
     
        })




module.exports = router;