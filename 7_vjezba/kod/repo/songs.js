const db = require('../db');

async function createSong(body) {
  const id = await db('songs').insert({ name: body.name }).then(ids => ids[0]);
  return getSongById(id);
}

async function getAllSongs() {
  return db('songs').select('*');
}

async function getSongById(songId) {
  return db('songs').where('id', songId).first();
}

async function updateSong(songId, body) {
  await db('songs').where('id', songId).update({ name: body.name });
  return getSongById(songId);
}

async function deleteSong(songId) {
  await db('authors_songs').where('song_id', songId).del();
  const deletedCount = await db('songs').where('id', songId).del();
  return deletedCount > 0;
}

module.exports = {
  createSong,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
};
