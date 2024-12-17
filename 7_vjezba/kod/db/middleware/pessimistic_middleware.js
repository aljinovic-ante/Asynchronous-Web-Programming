const resourceLocksRepo = require('../../repo/resource_locks');

const pessimisticLock = async (ctx, next) => {
  const { resource_type, resource_id } = ctx.request.body;
  const userId = ctx.state.user.id;

  const existingLock = await resourceLocksRepo.getLock(resource_type, resource_id);

  if (existingLock) {  //neko je vec zakljuca resurs
    if (existingLock.user_id !== userId) {
      ctx.status = 409;
      ctx.body = { message: 'Resource locked' };
      return;
    }
    return next();  //zakljuca trenutni user pa moze dalje
  }

  await resourceLocksRepo.createLock({ resource_type, resource_id, user_id: userId });

  try {
    await next();
  } finally {
    await resourceLocksRepo.deleteLockByUser(resource_id, userId);
  }
};

module.exports = {
  pessimisticLock,
};
