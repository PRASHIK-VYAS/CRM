const Company360 = require("./Company360");
const MoU = require("./MoU");
const Outreach = required("./Outreach")

Company360.hasMany(MoU, {
  foreignKey: "companyId",
  as: "mous",
});

MoU.belongsTo(Company360, {
  foreignKey: "companyId",
  as: "company",
});

Company360.hasMany(Outreach, {
  foreignKey : "companyId",
  as : "outreaches",
});

Outreach.belongsTo(Company360, {
  foreignKey : "companyId",
  as : "company"
})

module.exports = { Company360, MoU, Outreach, };
