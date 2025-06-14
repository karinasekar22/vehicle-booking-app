const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require('validator');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials!" });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        level: user.level,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login success",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        level: user.level,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role, level } = req.body;

  if(!email || !password){
    return res.status(400).json({message: "Email dan password harus diisi!"})
  }

  if(!validator.isEmail(email)){
    return res.status(400).json({message: 'Email tidak valid'});
  }
  if(password.length < 6) {
    return res.status(400).json({message: "Password minimal 6 karakter"});
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      level,
    });

    res.status(201).json({
      message: "User registered",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Register error" });
  }
};

exports.getProfile = async (req, res) => {
    try{
      const user = await User.findByPK(req.user.id, {
        attributes : { exclude: ['password']}
      });
      if (!user) return res.status(404).json({message: "User not found!"});

      res.json(user);
    } catch (err) {
      res.status(500).json({message: "Cannot get profile!", err});
    }
}