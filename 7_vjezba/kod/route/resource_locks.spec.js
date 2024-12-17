const { expect } = require('chai');
const { getAuthHeadersForUserId } = require('../apiTest');
const resourceLocksRepo = require('../repo/resource_locks');
const authorsRepo = require('../repo/authors');
const songsRepo = require('../repo/songs');

describe('Resource Locks routes', function () {
  let testAuthor, testSong;

  before(async function () {
    testAuthor = await authorsRepo.createAuthor({ name: 'Test Author' });
    testSong = await songsRepo.createSong({ name: 'Test Song' });
  });

  describe('POST /resource-locks', function () {
    it('should lock a resource', async function () {
      const response = await global.api
        .post('/resource-locks')
        .set('Authorization', await getAuthHeadersForUserId(1))
        .send({ resource_type: 'author', resource_id: testAuthor.id })
        .expect(201);

      expect(response.body.message).to.equal('Resource lockan');

      const lock = await resourceLocksRepo.getLock('author', testAuthor.id);
      expect(lock).to.not.be.null;
      expect(lock.resource_type).to.equal('author');
      expect(lock.resource_id).to.equal(testAuthor.id);
    });

    it('should return "Resource vec lockan" if resource is already locked', async function () {
      const response = await global.api
        .post('/resource-locks')
        .set('Authorization', await getAuthHeadersForUserId(2))
        .send({ resource_type: 'author', resource_id: testAuthor.id })
        .expect(409);

      expect(response.body.message).to.equal('Resource vec lockan');
    });
  });

  describe('DELETE /resource-locks/:resourceId', function () {
    it('should unlock the resource', async function () {
        await global.api
          .delete(`/resource-locks/${testAuthor.id}`)
          .set('Authorization', await getAuthHeadersForUserId(1))
          .expect(204);
    });            

    it('should return "Error no rights" if user does not own that specific lock', async function () {
      await resourceLocksRepo.createLock({
        resource_type: 'song',
        resource_id: testSong.id,
        user_id: 1,
      });

      const response = await global.api
        .delete(`/resource-locks/${testSong.id}`)
        .set('Authorization', await getAuthHeadersForUserId(2))
        .expect(403);

      expect(response.body.message).to.equal('Error no rights');

      const lock = await resourceLocksRepo.getLock('song', testSong.id);
      expect(lock).to.not.be.null;
    });
  });
});
