const bcrypt = require('bcryptjs');

const hashPassword = async(password)=>{
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
}

const comparePassword = async(password, hashPassword)=>{
    return await bcrypt.compare(password, hashPassword);
}

module.exports = {hashPassword, comparePassword}
