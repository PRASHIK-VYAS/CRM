const Company360 = require("./Company360");
const MoU = require("./MoU");
const Outreach = require("./Outreach");
const DealPipeline = require("./dealpipeline");
const User = require("./User");
const Alumni = require("./alumni");

// Company ↔ MoU
Company360.hasMany(MoU, {
  foreignKey: "companyId",
  as: "mous",
});

MoU.belongsTo(Company360, {
  foreignKey: "companyId",
  as: "company",
});

// Company ↔ Outreach
Company360.hasMany(Outreach, {
  foreignKey: "companyId",
  as: "outreaches",
});

Outreach.belongsTo(Company360, {
  foreignKey: "companyId",
  as: "company",
});

// Company ↔ Deal
Company360.hasMany(DealPipeline, {
  foreignKey: "companyId",
  as: "deals",
});

DealPipeline.belongsTo(Company360, {
  foreignKey: "companyId",
  as: "company",
});

// Company ↔ Alumni
Company360.hasMany(Alumni, {
  foreignKey: "companyId",
  as: "alumni",
});

Alumni.belongsTo(Company360, {
  foreignKey: "companyId",
  as: "company",
});

// User ↔ Deal
User.hasMany(DealPipeline, {
  foreignKey: "ownerId",
  as: "ownedDeals",
});

DealPipeline.belongsTo(User, {
  foreignKey: "ownerId",
  as: "owner",
});

module.exports = {
  Company360,
  MoU,
  Outreach,
  DealPipeline,
  User,
  Alumni,
};
