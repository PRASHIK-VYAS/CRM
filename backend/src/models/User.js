const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Roles = require('./enums/Role')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role : {
    type: DataTypes.ENUM(...Object.values(Roles)),
    allowNull: false,
    defaultValue: Roles.COORDINATOR
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  otp: {
    type:DataTypes.STRING,
    allowNull: true,
  },
  otpExpiry:{
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = User;