# Legacy Sequelize drafts

`StudentPortfolio` and `JobTracker` were not registered by the application and
their tables were not present when the PostgreSQL database was introspected on
2026-07-13. They are archived here to preserve their field definitions,
validation rules, hooks, scopes, and helper methods.

They are documentation only and are not loaded by the Prisma application.
Before implementing these features, translate the required fields into
`prisma/schema.prisma`, review the intended foreign keys, create a Prisma
migration, and move the business rules into services and request validation.
