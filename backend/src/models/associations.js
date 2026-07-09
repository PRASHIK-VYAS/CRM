const Company360 = require("./Company360");
const MoU = require("./MoU");

Company360.hasMany(MoU, {
  foreignKey: "companyId",
  as: "mous",
});

MoU.belongsTo(Company360, {
  foreignKey: "companyId",
  as: "company",
});

module.exports = { Company360, MoU };
