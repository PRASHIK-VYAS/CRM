const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Outreach = sequelize.define(
    "Outreach",
    {
        id: {
            type : DataTypes.UUID,
            defaultValue : DataTypes.UUIDV4,
            primaryKey : true, 
        },
        companyId :{
            type: DataTypes.UUID,
            allowNull : false,
            references : {
                model : "company360",
                key: "id",
            },
            onDelete : "CASCADE",
            onUpdate : "CASCADE",
        },
        outreachType : {
            type : DataTypes.ENUM(
                "EMAIL",
                "PHONE_CALL",
                "MEETING",
                "LINKEDIN",
                "VISIT",
                "EVENT",
                "PLACEMENT_DRIVE",
                "INTERNSHIP",
                "MOU_DISCUSSION",
                "FOLLOW_UP",
                "OTHER"
            ),
            allowNull : false,
        },
        subject : {
            type : DataTypes.STRING(255),
            allowNull : false,
        },
        description : {
            type : DataTypes.TEXT,
        },
        interactionDate : {
            type : DataTypes.DATE,
            allowNull : false,
            defaultValue: DataTypes.NOW,
        },
        outcome : {
            type : DataTypes.ENUM(
                "POSITIVE",
                "NEUTRAL",
                "NEGATIVE",
                "NO_RESPONSE",
                "FOLLOW_UP_REQUIRED"
            ),
            defaultValue : "NEUTRAL",
        },
        status : {
            type : DataTypes.ENUM(
                "PLANNED",
                "COMPLETED",
                "CANCELLED",
                "MISSED" 
            ),
            defaultValue: "PLANNED",
        },
        nextFollowUpDate: {
            type : DataTypes.DATE,
        },
        notes : {
            type : DataTypes.TEXT,
        },
        createdBy : {
            type : DataTypes.UUID,
            allowNull : false,
        },
        updatedBy : {
            type : DataTypes.UUID,
        },
        isActive : {
            type : DataTypes.BOOLEAN,
            defaultValue : true,
        },
    },
    {
        tableName : "outreaches",
        timestamps : true, 
        paranoid : true,

        indexes : [
            { fields : ["companyId"] },
            { fields : ["interactionDate"] },
            { fields : ["status"] },
            { fields : ["outcome"] },
            { fields : ["nextFollowUpDate"] },
        ],
    }
);

module.exports = Outreach;