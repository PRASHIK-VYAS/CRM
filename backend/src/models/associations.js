const Company360 = require("./company360.model");
const MoU = require("./mou.model");

Company360.hasMany(MoU, {
  foreignKey: "companyId",
  as: "mous",
});

MoU.belongsTo(Company360, {
  foreignKey: "companyId",
  as: "company",
});