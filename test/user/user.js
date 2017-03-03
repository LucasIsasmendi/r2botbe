process.env.NODE_ENV = 'test'
// process.env.FOLDER_OUTPUT = 'outputr2'
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server/index')
const should = chai.should()

chai.use(chaiHttp)

describe('-> Vote and check vote', () => {
  describe('Test response', () => {
    describe('/GET test', () => {
      it('it should GET "response from API user"', (done) => {
        chai.request(server)
          .get('/user/test')
          .end((err, res) => {
            if (err) throw err
            res.should.have.status(200)
            res.text.should.be.eql('response from API user')
            done()
          })
      })
    })
  })
  const phone = '123456789'
  const hkid = '11111'
  describe('vote', () => {
    it(`it should vote from ${phone}`, (done) => {
      chai.request(server)
        .post('/user/votedone')
        .send({phone: phone, hkid: hkid})
        .end((err, res) => {
          if (err) throw err
          res.should.have.status(200)
          res.text.should.be.eql('vote done')
          done()
        })
    })
  })
  describe('check vote', () => {
    it(`it should check that user ${phone} voted`, (done) => {
      chai.request(server)
        .get('/user/doesitvote')
        .send({phone: phone, hkid: hkid})
        .end((err, res) => {
          if (err) throw err
          res.should.have.status(200)
          res.text.should.be.eql('user vote')
          done()
        })
    })
  })
})
