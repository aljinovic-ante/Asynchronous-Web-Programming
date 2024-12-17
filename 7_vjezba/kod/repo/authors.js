const db = require('../db');

async function createAuthor(body) {
  const id = await db('authors').insert({ name: body.name }).then(ids => ids[0]);
  return getAuthorById(id);
}

async function getAllAuthors() {
  return db('authors').select('*');
}

async function getAuthorById(authorId) {
  return db('authors').where('id', authorId).first();
}

async function updateAuthor(authorId, body) {
  await db('authors').where('id', authorId).update({ name: body.name });
  return getAuthorById(authorId);
}

async function deleteAuthor(authorId) {
  await db('authors_songs').where('author_id', authorId).del();
  const deletedCount = await db('authors').where('id', authorId).del();
  return deletedCount > 0;
}

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};