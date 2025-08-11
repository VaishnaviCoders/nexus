// prisma.$use(async (params, next) => {
// const orgId = await getOrganizationId();

// // Tables that are tenant-aware
// const tenantModels = ['Student', 'Teacher', 'Parent', 'FeeRecord'];

// if (tenantModels.includes(params.model || '')) {
// // If it's a read operation
// if (['findMany', 'findFirst', 'findUnique'].includes(params.action)) {
// params.args = params.args || {};
// params.args.where = {
// ...params.args.where,
// organizationId: orgId,
// };
// }

// // If it's a write operation
// if (['create', 'update', 'upsert'].includes(params.action)) {
// params.args.data = {
// ...params.args.data,
// organizationId: orgId,
// };
// }
// }

// return next(params);
// });
