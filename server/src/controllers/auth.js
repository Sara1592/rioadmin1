const db = require('../db')
const { hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants')

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query('select user_id, email from rioadmin')

    return res.status(200).json({
      success: true,
      rioadmin: rows,
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.getRegister = async (req, res) => {
  try {
    const { rows } = await db.query('select user_id, email from collegeadmin')

    return res.status(200).json({
      success: true,
      collegeadmin: rows,
    })
  } catch (error) {
    console.log(error.message)
  }
}


exports.register = async (req, res) => {
  const { email, password } = req.body
  try {
    const hashedPassword = await hash(password, 10)

    await db.query('insert into rioadmin(email,password) values ($1 , $2)', [
      email,
      hashedPassword,
    ])

    return res.status(201).json({
      success: true,
      message: 'The registraion was successfull',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.login = async (req, res) => {
  let user = req.user

  let payload = {
    id: user.user_id,
    email: user.email,
  }

  try {
    const token = await sign(payload, SECRET)

    return res.status(200).cookie('token', token, { httpOnly: true }).json({
      success: true,
      message: 'Logged in succefully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.protected = async (req, res) => {
  try {
    return res.status(200).json({
      info: 'protected info',
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie('token', { httpOnly: true }).json({
      success: true,
      message: 'Logged out succefully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}


// register college

exports.getCollege = async (req, res) => {
  try {
    const { rows } = await db.query('select coll_id, email from colreg')

    return res.status(200).json({
      success: true,
      colreg: rows,
    })
  } catch (error) {
    console.log(error.message)
  }
}



// exports.collegereg = async (req, res) => {
//   const { coll_id, email } = req.body
//   console.log(req.body)
//   try {
  

//     await db.query('insert into regcol(coll_id, email ) values ($1 , $2)', [
//       coll_id,
//       email,
      
//     ])

//     return res.status(201).json({
//       success: true,
//       message: 'College registraion was successfull',
//     })
//   } catch (error) {
//     console.log(error.message)
//     return res.status(500).json({
//       error: error.message,
//     })
//   }
// }


exports.collegereg = async (req, res) => {
  const { coll_id, email} = req.body
  try {

    await db.query('insert into colreg(coll_id, email) values ($1 , $2)', [
      coll_id,
      email,
    ])

    return res.status(201).json({
      success: true,
      message: 'College register was successfull',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.collogin = async (req, res) => {
  let user = req.user

  let payload = {
    coll_id: user.coll_id,
    email: user.email,
  
  }

  try {
    const token = await sign(payload, SECRET)

    return res.status(200).cookie('token', token, { httpOnly: true }).json({
      success: true,
      message: 'Email Send Successfull',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}


exports.colprotected = async (req, res) => {
  try {
    return res.status(200).json({
      info: 'protected info',
    })
  } catch (error) {
    console.log(error.message)
  }
}

//user Register

exports.userregister = async (req, res) => {
  const { email, password } = req.body
  try {
    const hashedPassword = await hash(password, 10)

    await db.query('insert into collegeadmin(email,password) values ($1 , $2)', [
      email,
      hashedPassword,
    ])

    return res.status(201).json({
      success: true,
      message: 'The registraion was successfull',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}