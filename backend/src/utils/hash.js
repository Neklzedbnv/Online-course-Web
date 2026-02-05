const bcrypt = require('bcrypt');


const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Ошибка при хэшировании пароля');
  }
};


const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Ошибка при сравнении паролей');
  }
};

module.exports = { hashPassword, comparePassword };
