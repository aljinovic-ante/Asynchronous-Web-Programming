const {expect}=require('chai')
const songsRepo=require('../repo/songs')
const { getAuthHeadersForUserId } = require('../apiTest')

describe('Song routes',function(){
    describe('GET /songs',function(){
        it('should fetch songs',async function(){
            const response=await global.api.get('/songs').expect(200)
            console.log(response.body)
            expect(response.body.length > 0).to.be.true
            expect(Object.keys(response.body[0])).to.deep.equal(['id','name','created_at'])
        })
    })

    describe('POST /songs', async function(){
        it('should create a new song',async function(){
            const songName='Volin piti'
            const response=await global.api.post('/songs').set('Authorization', await getAuthHeadersForUserId(1)).send({name:songName}).expect(200)

            expect(response.body.name).to.be.equal(songName)
        })
    })

    describe('GET /songs/:songId', async function(){
        let createdSong

        before(async function () {
          createdSong = await songsRepo.createSong({
            name: 'Volin jist',
          })
        })

        it('should fetch the song by id', async function () {
          const response = await global.api.get(`/songs/${createdSong.id}`).expect(200)

          expect(response.body.name).to.be.equal(createdSong.name)
        })
    })

    describe('PUT /songs/:songId', function () {
        let createdSong;
    
        before(async function () {
          createdSong = await songsRepo.createSong({ name: 'Stara pisma' });
        });
    
        it('should update the song name', async function () {
          const updatedName = 'Nova pisma';
          const response = await global.api
            .put(`/songs/${createdSong.id}`)
            .set('Authorization', await getAuthHeadersForUserId(1))
            .send({ name: updatedName })
            .expect(200);
    
          expect(response.body.name).to.be.equal(updatedName);
    
          const fetchedSong = await global.api.get(`/songs/${createdSong.id}`).expect(200);
          expect(fetchedSong.body.name).to.be.equal(updatedName);
        });
      });
    
      describe('DELETE /songs/:songId', function () {
        let createdSong;
    
        before(async function () {
          createdSong = await songsRepo.createSong({ name: 'Ono šta brišen' });
        });
    
        it('should delete the song by id', async function () {
          await global.api.delete(`/songs/${createdSong.id}`).set('Authorization', await getAuthHeadersForUserId(1)).expect(204);
          await global.api.get(`/songs/${createdSong.id}`).expect(404);
        });      
    });
})