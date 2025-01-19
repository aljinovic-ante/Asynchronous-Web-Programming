const db = require('../db');
async function createAuthor(body) {
  return db('authors').insert({
    name: body.name,
  });
}
async function getAllAuthors() {
  return db('authors').select('*');
}
async function getAuthorById(authorId) {
  return db('authors').where('id', authorId).first();
}
async function updateAuthor(authorId, body) {
  return db('authors').where('id', authorId).update({
    name: body.name,
  });
}
async function deleteAuthor(authorId) {
  await db('authors_songs').where('author_id', authorId).del();
  return db('authors').where('id', authorId).del();
}
module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};