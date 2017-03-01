process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server/index')
const should = chai.should()

chai.use(chaiHttp)

describe('Test response', () => {
  describe('/GET test', () => {
    it('it should GET "response from API vote"', (done) => {
      chai.request(server)
        .get('/test')
        .end((err, res) => {
          if (err) throw err
          res.should.have.status(200)
          res.text.should.be.eql('response from API vote')
          done()
        })
    })
  })
})
describe('Full test API VOTE', () => {
  describe('/GET getnewkey', () => {
    it('it should GET a new key', (done) => {
      chai.request(server)
        .get('/getnewkey')
        .end((err, res) => {
          if (err) throw err
          console.log('res', res)
          res.should.have.status(200)
          res.text.should.be.eql('response from API vote')
          done()
        })
    })
  })
})
