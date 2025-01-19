const db = require('../db');
async function createAuthorSongRelation(authorId, songId) {
  return db('authors_songs').insert({
    author_id: authorId,
    song_id: songId,
  });
}
async function deleteAuthorSongRelation(authorId, songId) {
  return db('authors_songs')
    .where({ author_id: authorId, song_id: songId })
    .del();
}
async function getSongsByAuthorId(authorId) {
  return db('authors_songs')
    .join('songs', 'authors_songs.song_id', 'songs.id')
    .where('authors_songs.author_id', authorId)
    .select('songs.id', 'songs.name');
}
module.exports = {
  createAuthorSongRelation,
  deleteAuthorSongRelation,
  getSongsByAuthorId,
};