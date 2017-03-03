process.env.NODE_ENV = 'test'
// process.env.FOLDER_OUTPUT = './output-r2/'
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server/index')
const should = chai.should()

chai.use(chaiHttp)

describe('Full test API VOTE', () => {
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
  let voter
  const ballot = 'soaasso'
  let signedvote
  describe('/GET getnewkey', () => {
    it('it should GET a new key', (done) => {
      chai.request(server)
        .get('/getnewkey')
        .end((err, res) => {
          if (err) throw err
          voter = res.body
          // write to file
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('sk')
          res.body.should.have.property('pubk')
          res.body.should.have.property('address')
          res.body.sk.should.have.length.above(34)
          done()
        })
    })
  })
  describe('/doesitvote', () => {
    it('it should GET address without vote', (done) => {
      chai.request(server)
        .get('/doesitvote')
        .send({address: voter.address})
        .end((err, res) => {
          if (err) throw err
          res.should.have.status(200)
          res.text.should.be.eql('address without vote')
          done()
        })
    })
  })
  describe('/signballot', () => {
    it(`it should sign the ballot ${ballot}`, (done) => {
      chai.request(server)
        .get('/signballot')
        .send({ballot: ballot, secretkey: voter.sk})
        .end((err, res) => {
          if (err) throw err
          signedvote = res.body.signedvote
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('signedvote')
          // console.log('signedvote', signedvote)
          done()
        })
    })
  })
  describe('/checksignature', () => {
    it(`it should check signature ${signedvote} from ballot ${ballot} is "valid signature"`, (done) => {
      chai.request(server)
        .get('/checksignature')
        .send({address: voter.address, plainvote: ballot, signedvote: signedvote})
        .end((err, res) => {
          if (err) throw err
          res.should.have.status(200)
          res.text.should.be.eql('valid signature')
          done()
        })
    })
  })
  describe('/castvote', () => {
    it(`it should vote ${ballot}`, (done) => {
      chai.request(server)
        .post('/castvote')
        .send({address: voter.address, plainvote: ballot, signedvote: signedvote})
        .end((err, res) => {
          if (err) throw err
          res.should.have.status(200)
          res.text.should.be.eql('vote processed successfully!')
          done()
        })
    })
  })
})
