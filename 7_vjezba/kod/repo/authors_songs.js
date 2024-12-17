const db = require('../db');

async function createAuthorSongRelation(authorId, songId) {
  const id = await db('authors_songs').insert({
    author_id: authorId,
    song_id: songId,
  }).then(ids => ids[0]);
  return {
    authorId,
    songId,
  };
}

async function deleteAuthorSongRelation(authorId, songId) {
  const deletedCount = await db('authors_songs')
    .where({ author_id: authorId, song_id: songId })
    .del();
  return deletedCount > 0;
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