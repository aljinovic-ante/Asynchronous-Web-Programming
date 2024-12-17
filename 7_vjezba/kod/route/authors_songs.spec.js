const { expect } = require('chai');
const authorsSongsRepo = require('../repo/authors_songs');
const songsRepo = require('../repo/songs');
const authorsRepo = require('../repo/authors');
const { getAuthHeadersForUserId } = require('../apiTest')

describe('Author Song routes', function () {
  let createdAuthor;
  let createdSong1;
  let createdSong2;

  before(async function () {
    createdAuthor = await authorsRepo.createAuthor({ name: 'Testni Autor 1' });
    createdSong1 = await songsRepo.createSong({ name: 'Testna Pisma 1' });
    createdSong2 = await songsRepo.createSong({ name: 'Testna Pisma 2' });
  
    expect(createdAuthor.id).to.be.a('number');
    expect(createdSong1.id).to.be.a('number');
    expect(createdSong2.id).to.be.a('number');

    await authorsSongsRepo.createAuthorSongRelation(createdAuthor.id, createdSong1.id);
    await authorsSongsRepo.createAuthorSongRelation(createdAuthor.id, createdSong2.id);
  });

  describe('GET /authors/:authorId/songs', function () {
    it('should get songs for the author', async function () {
      const response = await global.api
        .get(`/authors/${createdAuthor.id}/songs`)
        .expect(200);
      
      console.log('koje su to pisme', response.body)

      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.equal(2);
      expect(response.body[0]).to.have.keys(['id', 'name']);
    });
  });

  describe('DELETE /authors/:authorId/songs/:songId', function () {
    it('should delete the relation between author and song', async function () {
      const response = await global.api
        .delete(`/authors/${createdAuthor.id}/songs/${createdSong1.id}`)
        .set('Authorization', await getAuthHeadersForUserId(1))
        .expect(200);

      expect(response.body.message).to.equal('Relation deleted');
    });
  });

  
  describe('POST /authors/:authorId/songs/:songId', function () {
    it('should create a relation between author and song', async function () {
      const response = await global.api
        .post(`/authors/${createdAuthor.id}/songs/${createdSong1.id}`)
        .set('Authorization', await getAuthHeadersForUserId(1))
        .expect(200);

        expect(parseInt(response.body.authorId)).to.be.equal(createdAuthor.id);
        expect(parseInt(response.body.songId)).to.be.equal(createdSong1.id);
    });
  });
});
