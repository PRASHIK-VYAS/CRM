const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MoU = sequelize.define(
  "MoU",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "company360",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    mouNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    purpose: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    signedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "DRAFT",
        "PENDING",
        "ACTIVE",
        "EXPIRED",
        "TERMINATED",
        "RENEWED"
      ),
      defaultValue: "DRAFT",
      allowNull: false,
    },

    collaborationType: {
      type: DataTypes.ENUM(
        "PLACEMENTS",
        "INTERNSHIPS",
        "TRAINING",
        "RESEARCH",
        "CONSULTANCY",
        "INDUSTRY_VISIT",
        "WORKSHOP",
        "MULTIPLE",
        "OTHER"
      ),
      allowNull: false,
    },

    signedByCompany: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    signedByInstitute: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    renewalReminderDays: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },

    documentUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },

    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "mous",
    timestamps: true,
    paranoid: true,

    indexes: [
      {
        unique: true,
        fields: ["mouNumber"],
      },
      {
        fields: ["companyId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["endDate"],
      },
      {
        fields: ["collaborationType"],
      },
    ],
  }
);

module.exports = MoU;