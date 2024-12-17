const {expect}=require('chai')
const authorsRepo=require('../repo/authors')
const { getAuthHeadersForUserId } = require('../apiTest')

describe('Author routes',function(){
    describe('GET /authors',function(){
        before(async function () {
          createdAuthor = await authorsRepo.createAuthor({
            name: 'Toncon',
          })
        })
        it('should fetch authors',async function(){
            const response=await global.api.get('/authors').expect(200)
            console.log(response.body)
            expect(response.body.length > 0).to.be.true
            expect(Object.keys(response.body[0])).to.deep.equal(['id','name','created_at'])
        })
    })

    describe('POST /authors', async function(){
        it('should create a new author',async function(){
            const authorName='Siniša Vuco'
            const response=await global.api.post('/authors').set('Authorization', await getAuthHeadersForUserId(1)).send({name:authorName}).expect(200)

            expect(response.body.name).to.be.equal(authorName)
        })
    })

    describe('GET /authors/:authorId', async function(){
        let createdAuthor

        before(async function () {
          createdAuthor = await authorsRepo.createAuthor({
            name: 'Toncon',
          })
        })

        it('should fetch the author by id', async function () {
          const response = await global.api.get(`/authors/${createdAuthor.id}`).expect(200)

          expect(response.body.name).to.be.equal(createdAuthor.name)
        })
    })

    describe('PUT /authors/:authorId', function () {
        let createdAuthor;
    
        before(async function () {
            createdAuthor = await authorsRepo.createAuthor({ name: 'Novi autor neman inspiracije' });
        });
    
        it('should update the author name', async function () {
          const updatedName = 'Novi autor 2?';
          const response = await global.api
            .put(`/authors/${createdAuthor.id}`)
            .set('Authorization', await getAuthHeadersForUserId(1))
            .send({ name: updatedName })
            .expect(200);
    
          expect(response.body.name).to.be.equal(updatedName);
    
          const fetchedAuthor = await global.api.get(`/authors/${createdAuthor.id}`).expect(200);
          expect(fetchedAuthor.body.name).to.be.equal(updatedName);
        });
      });
    
      describe('DELETE /authors/:authorId', function () {
        let createdAuthor;
    
        before(async function () {
            createdAuthor = await authorsRepo.createAuthor({ name: 'Autor kojeg brišen' });
        });
    
        it('should delete the author by id', async function () {
          await global.api.delete(`/authors/${createdAuthor.id}`).set('Authorization', await getAuthHeadersForUserId(1)).expect(204);
          await global.api.get(`/authors/${createdAuthor.id}`).expect(404);
        });
    });
})