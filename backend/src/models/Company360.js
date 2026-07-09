const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Company360 = sequelize.define(
  "Company360",
  {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    companyCode : {
      type : DataTypes.STRING(20),
      allowNull : false,
      unique : true,
    },

    companyName:{
      type :DataTypes.STRING(255),
      allowNull : false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },

    industry: {
      type: DataTypes.ENUM(
        "IT",
        "Finance",
        "Healthcare",
        "Manufacturing",
        "Education",
        "Consulting",
        "Telecommunication",
        "E-Commerce",
        "Automobile",
        "Construction",
        "Other"
      ),
      allowNull: false,
    },

    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

     phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    linkedin: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },

    headOffice: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "India",
    },

    postalCode: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },

    companySize: {
      type: DataTypes.ENUM(
        "1-50",
        "51-200",
        "201-500",
        "501-1000",
        "1000+"
      ),
      allowNull: true,
    },

    foundedYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1800,
        max: new Date().getFullYear(),
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "ACTIVE",
        "INACTIVE",
        "PROSPECT",
        "BLACKLISTED"
      ),
      allowNull: false,
      defaultValue: "PROSPECT",
    },

    partnershipLevel: {
      type: DataTypes.ENUM(
        "NONE",
        "BASIC",
        "PREMIUM",
        "STRATEGIC"
      ),
      allowNull: false,
      defaultValue: "NONE",
    },

    relationshipStage: {
      type: DataTypes.ENUM(
        "Cold Lead",
        "Contacted",
        "Interested",
        "Meeting Scheduled",
        "Proposal Sent",
        "Negotiation",
        "MoU Signed",
        "Hiring",
        "Strategic Partner",
        "Inactive"
      ),
      allowNull: false,
      defaultValue: "Cold Lead",
    },


    healthScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    nextFollowUpDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    totalPlacements: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    totalOffers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    totalVisits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },


    totalMoUs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
      allowNull: false,
      defaultValue: true,
    },


    
  },
   {
    tableName: "company360",

    timestamps: true,

    paranoid: true,

    indexes: [
      {
        unique: true,
        fields: ["companyCode"],
      },
      {
        unique: true,
        fields: ["companyName"],
      },
      {
        fields: ["industry"],
      },
      {
        fields: ["relationshipStage"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["partnershipLevel"],
      },
      {
        fields: ["city"],
      },
      {
        fields: ["healthScore"],
      },
      {
        fields: ["nextFollowUpDate"],
      },
    ],
  }
);

module.exports = Company360