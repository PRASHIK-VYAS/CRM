// models/alumni.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Alumni = sequelize.define(
  "Alumni",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    alumniCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    batchYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    currentDesignation: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    seniorityLevel: {
      type: DataTypes.ENUM(
        "Entry Level",
        "Mid Level",
        "Senior Level",
        "Lead",
        "Manager",
        "Director",
        "Founder",
        "HR",
        "Other"
      ),
      allowNull: false,
      defaultValue: "Entry Level",
    },

    companyId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "company360",
        key: "id",
      },
    },

    linkedin: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },

    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    skills: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },

    willingnessToHelp: {
      type: DataTypes.ENUM("Yes", "No", "Maybe"),
      allowNull: false,
      defaultValue: "Maybe",
    },

    helpTypes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },

    influenceScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    relationshipScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    lastContactedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("Active", "Inactive", "Not Reachable"),
      allowNull: false,
      defaultValue: "Active",
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "alumni",
    timestamps: true,
  }
);

module.exports = Alumni;