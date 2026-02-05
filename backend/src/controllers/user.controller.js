const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email уже используется!" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = new User({ email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "Пользователь успешно зарегистрирован!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера!" });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден!" });
    }

    // Проверяем пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный пароль!" });
    }

    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера!" });
  }
};


exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден!" });
    }
    res.status(200).json({ email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера!" });
  }
};


exports.updateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const user = await User.findByIdAndUpdate(req.userId, {
      email,
      password: hashedPassword || undefined,
    }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден!" });
    }

    res.status(200).json({ message: "Информация обновлена успешно!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера!" });
  }
};
