let Brands = require('../initial-data/brands.json')

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app/server.js');

let should = chai.should();

chai.use(chaiHttp);


describe('/GET brands', () => {
    it('should GET a list of all brands', done => {
      // act
      chai
        .request(server)
        .get('/api/brands')
        .end((err, res) => {
          // assert
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.be.eql(5)
          done();
        });
    });
});

describe('/GET brand products', () => {
  it('should GET all products of a given brand', done => {
    // act
    chai
      .request(server)
      .get(`/api/brands/2/products`)
      .end((err, res) => {
        // assert
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(2)
        done();
      });
  });
  it ('should error if invalid brand id is passed', done => {
    chai
      .request(server)
      .get(`/api/brands/6/products`)
      .end((err, res) => {
        // assert
        res.should.have.status(404);
        done();
      });
    });
  it ('should error if no brand id is passed', done => {
    chai
      .request(server)
      .get(`/api/brands//products`)
      .end((err, res) => {
        // assert
        res.should.have.status(404);
        done();
      });
    });  
});

describe('/GET products', () => {
  it('should GET a list of all products that match query', done => {
    // act
    chai
      .request(server)
      .get('/api/products')
      .send({ query: 'awful'})
      .end((err, res) => {
        // assert
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(1)
        done();
      });
  });
  it('should error if no query is passed', done => {
    // act
    chai
      .request(server)
      .get('/api/products')
      .send({ query: '' })
      .end((err, res) => {
        // assert
        res.should.have.status(400);
        done();
      });
  });
});

describe('/POST login', () => {
  it('should create user session for a valid user', done => {
    let login = {
        username: 'greenlion235', 
        password: 'waters' 
      }
    // act
    chai
      .request(server)
      .post('/api/login')
      .send(login)
      .end((err, res) => {
        // assert
        res.should.have.status(200);
        done();
      });
  });
  it('should not create user session for an invalid username or password', done => {
    let login = {
        username: 'greenlion23', 
        password: 'waters' 
      } 
    // act
    chai
      .request(server)
      .post('/api/login')
      .send(login)
      .end((err, res) => {
        // assert
        res.should.have.status(401);
        done();
      });
  });
  it('should not create user session for a blank username or password', done => {
    let login = {
        username: '', 
        password: 'waters' 
      }
    
    // act
    chai
      .request(server)
      .post('/api/login')
      .send(login)
      .end((err, res) => {
        // assert
        res.should.have.status(400);
        done();
      });
  });
});

describe('/GET cart', () => {
  it('should GET all items in the cart', done => {
    // act
    chai
      .request(server)
      .get('/api/me/cart')
      .send({accessToken: '123456'})
      .end((err, res) => {
        // assert
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(0)
        done();
      });
  });
  it('should not get cart items if accessToken is invalid', done => {
    // act
    chai
      .request(server)
      .get('/api/me/cart')
      .send({accessToken: '12346'})
      .end((err, res) => {
        // assert
        res.should.have.status(401);
        done();
      });
  });
  it('should not get cart items if accessToken is missing', done => {
    // act
    chai
      .request(server)
      .get('/api/me/cart')
      .end((err, res) => {
        // assert
        res.should.have.status(401);
        done();
      });
  });
});

describe('/POST cart', () => {
  it('should add an item to the cart', done => {
    // act
    chai
      .request(server)
      .post('/api/me/cart')
      .send({accessToken: '123456', id: 9})
      .end((err, res) => {
        // assert
        res.should.have.status(200);
        done();
      });
  });
  it('should not add an item to the cart that does not exist', done => {
    // act
    chai
    .request(server)
    .post('/api/me/cart')
    .send({accessToken: '123456', id: 15})
    .end((err, res) => {
      // assert
      res.should.have.status(404);
      done();
    });
  });
  it('should not allow someone without an access token to add to cart', done => {
    // act
    chai
    .request(server)
    .post('/api/me/cart')
    .send({id: 15})
    .end((err, res) => {
      // assert
      res.should.have.status(401);
      done();
    });
  });
  it('should not allow someone without an access token to add to cart', done => {
    // act
    chai
    .request(server)
    .post('/api/me/cart')
    .send({accessToken: 'cat', id: 15})
    .end((err, res) => {
      // assert
      res.should.have.status(401);
      done();
    });
  });
});

describe('/POST cart', () => {
  it('should add an item to the cart', done => {
    // act
    chai
      .request(server)
      .post('/api/me/cart/9')
      .send({accessToken: '123456'})
      .end((err, res) => {
        // assert
        res.should.have.status(200);
        done();
      });
  });
  it('should not add an item to the cart that does not exist', done => {
    // act
    chai
    .request(server)
    .post('/api/me/cart/15')
    .send({accessToken: '123456'})
    .end((err, res) => {
      // assert
      res.should.have.status(404);
      done();
    });
  });
  it('should not allow someone without an access token to add to cart', done => {
    // act
    chai
    .request(server)
    .post('/api/me/cart/15')
    .send()
    .end((err, res) => {
      // assert
      res.should.have.status(401);
      done();
    });
  });
  it('should not allow someone without an access token to add to cart', done => {
    // act
    chai
    .request(server)
    .post('/api/me/cart/15')
    .send({accessToken: 'cat'})
    .end((err, res) => {
      // assert
      res.should.have.status(401);
      done();
    });
  });
});

describe('/DELETE products', () => {
  it('should delete an item from the cart', done => {
    // act
    chai
      .request(server)
      .post('/api/me/cart/2')
      .send({accessToken: '123456'})
      .end((err, res) => {
        chai
          .request(server)
          .delete('/api/me/cart/2')
          .send({accessToken: '123456'})
          .end((err, res) => {
            // assert
            res.should.have.status(200);
            
            // check it's actually gone
            chai 
              .request(server)
              .get('/api/me/cart')
              .send({accessToken: '123456'})
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.length.should.be.eql(2)
                done();
              });
          });
      });
  });

  it('should not allow a user with an invalid access code to delete an item from the cart', done => {
    // act
    chai
      .request(server)
      .post('/api/me/cart/2')
      .send({accessToken: '123456'})
      .end((err, res) => {
        chai
          .request(server)
          .delete('/api/me/cart/2')
          .send({accessToken: '12345'})
          .end((err, res) => {
            // assert
            res.should.have.status(401);
            done()
          });
      });
  });
  it('should not allow a user with no access code to delete an item from the cart', done => {
    // act
    chai
      .request(server)
      .post('/api/me/cart/2')
      .send({accessToken: '123456'})
      .end((err, res) => {
        chai
          .request(server)
          .delete('/api/me/cart/2')
          .end((err, res) => {
            // assert
            res.should.have.status(401);
            done();
          });
      });
  });
  it('should not allow a user to delete an item from the cart that was never there', done => {
    // act
    chai
      .request(server)
      .delete('/api/me/cart/3')
      .send({accessToken: '123456'})
      .end((err, res) => {
        // assert
        res.should.have.status(404);
        done();
      });
  });
  it('should not allow a user to delete an item from the cart that does not exist', done => {
    // act
    chai
      .request(server)
      .delete('/api/me/cart/16')
      .send({accessToken: '123456'})
      .end((err, res) => {
        // assert
        res.should.have.status(404);
        done();
      });
  });
});




