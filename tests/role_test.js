import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
chai.should();

describe("Role Test", () => {
    describe("GET /roles", () => {
        it("should get all roles", (done) => {
            chai.request("http://localhost:5000")
                .get("/roles")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });

        it("should get role by id", (done) => {
            chai.request("http://localhost:5000")
                .get("/roles/1")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });

        it("should not get role by id", (done) => {
            chai.request("http://localhost:5000")
                .get("/roles/100")
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
})
