import chai from "chai"
import chaiHttp from "chai-http"
import { describe } from "node:test"

chai.use(chaiHttp)
chai.should()

describe('Backend is running...', () => {
    it('Should return 200 OK', (done) => {
        chai.request('http://localhost:5000')
            .get('/')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.not.have.property('error')
                done()
            })
    })
})