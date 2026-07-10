
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DealPipeline = sequelize.define(
  "DealPipeline",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    dealCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    stage: {
      type: DataTypes.ENUM(
        "Cold Lead",
        "Contacted",
        "Meeting Scheduled",
        "Meeting Completed",
        "Interested",
        "Proposal Sent",
        "Negotiation",
        "MoU Discussion",
        "MoU Signed",
        "Hiring Started",
        "Strategic Partner",
        "On Hold",
        "Lost"
      ),
      allowNull: false,
      defaultValue: "Cold Lead",
    },

    priority: {
      type: DataTypes.ENUM(
        "Low",
        "Medium",
        "High",
        "Critical"
      ),
      allowNull: false,
      defaultValue: "Medium",
    },

    probability: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        min: 0,
        max: 100,
      },
    },

    expectedStudents: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    expectedCTC: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },

    expectedHiringDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    source: {
      type: DataTypes.ENUM(
        "Cold Email",
        "Referral",
        "Alumni",
        "Website",
        "LinkedIn",
        "Campus Drive",
        "Previous Partner",
        "Conference",
        "Other"
      ),
      allowNull: false,
      defaultValue: "Other",
    },

    leadOwner: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    decisionMaker: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    decisionMakerEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

    decisionMakerPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    lastActivityDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    nextFollowUpDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    nextAction: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    meetingDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    proposalSentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    mouExpectedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    closeDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    lostReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    competitorCollege: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    riskLevel: {
      type: DataTypes.ENUM(
        "Low",
        "Medium",
        "High"
      ),
      allowNull: false,
      defaultValue: "Low",
    },

    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    }
  },
  {
    tableName: "deal_pipeline",
    timestamps: true,
    paranoid: true,

    indexes: [
      { unique: true, fields: ["dealCode"] },
      { fields: ["companyId"] },
      { fields: ["ownerId"] },
      { fields: ["stage"] },
      { fields: ["priority"] },
      { fields: ["nextFollowUpDate"] },
      { fields: ["probability"] },
      { fields: ["expectedHiringDate"] },
    ],
  }
);

module.exports = DealPipeline;
