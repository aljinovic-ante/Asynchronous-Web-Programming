const db = require('../db');

const getLock = async (resource_type, resource_id) => {
  return db('resource_locks')
    .where({ resource_type, resource_id })
    .first();
};

const createLock = async ({ resource_type, resource_id, user_id }) => {
  return db('resource_locks').insert({ resource_type, resource_id, user_id });
};

const deleteLockByUser = async (resource_id, user_id) => {
  return db('resource_locks')
    .where({ resource_id, user_id })
    .del();
};

module.exports = {
  getLock,
  createLock,
  deleteLockByUser,
};
