const db = require('../db');
async function createSong(body) {
  return db('songs').insert({
    name: body.name,
  });
}
async function getAllSongs() {
  return db('songs').select('*');
}
async function getSongById(songId) {
  return db('songs').where('id', songId).first();
}
async function updateSong(songId, body) {
  return db('songs').where('id', songId).update({
    name: body.name,
  });
}
async function deleteSong(songId) {
  await db('authors_songs').where('song_id', songId).del();
  return db('songs').where('id', songId).del();
}
module.exports = {
  createSong,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
};