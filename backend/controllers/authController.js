const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//  REGISTRO
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // verificar si existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Usuario ya existe' });
    }

    // encriptar password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // crear usuario
    user = new User({
      nombre,
      email,
      password: hashedPassword,
      rol
    });

    await user.save();

    res.status(201).json({ msg: 'Usuario registrado' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // comparar password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // crear token
    const token = jwt.sign(
  { id: user._id, rol: user.rol },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

    res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};