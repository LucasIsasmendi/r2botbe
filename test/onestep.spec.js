process.env.NODE_ENV = 'test'
// process.env.FOLDER_OUTPUT = 'outputr2'
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
describe('One Step test API VOTE', () => {
  const ballot = 'osassao'
  describe('/castvotefull', () => {
    it(`it should vote ${ballot}`, (done) => {
      chai.request(server)
        .post('/castvotefull')
        .send({plainvote: ballot})
        .end((err, res) => {
          if (err) throw err
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.key.should.have.property('sk')
          res.body.key.should.have.property('pubk')
          res.body.key.should.have.property('address')
          res.body.key.address.should.have.length.above(33)
          res.body.ballot.should.have.property('vote')
          res.body.status.should.be.eql('vote processed successfully!')
          done()
        })
    })
  })
})
describe('/GET file', () => {
  it('it should GET voters file', (done) => {
    chai.request(server)
      .get('/downloadfile/voters')
      .end((err, res) => {
        if (err) throw err
        console.log('voters', res)
        res.should.have.status(200)
        res.text.should.be.eql('response from API vote')
        done()
      })
  })
})
