import jwt from 'jwt-simple';

describe('Routes: Users', () => {
  const Users = app.db.models.Users;
  const jwtSecret = app.libs.config.jwtSecret;
  let token;

  beforeEach(done => {
    Users.destroy({where: {}})
      .then(() => Users.create({
        name: 'john',
        email: 'john@example.com',
        password: '123456'
      }))
      .then(user => {
        token = jwt.encode({id: user.id}, jwtSecret);
        done();
      });
  });

  describe('GET /user', () => {
    describe('status 200', () => {
      it('returns an authenticated user', done => {
        request.get('/user')
          .set('Authorization', `jwt ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.email).to.eql('john@example.com');
            done(err);
          });
      });
    });

    describe('status 401', () => {
      it('returns an unauthorized error', done => {
        request.get('/user')
          .expect(401)
          .end((err, res) => done(err));
      });
    });
  });

  describe('DELETE /user', () => {
    describe('status 204', () => {
      it('deletes an authenticated user', done => {
        request.delete('/user')
          .set('Authorization', `jwt ${token}`)
          .expect(204)
          .end((err, res) => {
            done(err);
          });
      });
    });
  });

  describe('POST /users', () => {
    describe('status 200', () => {
      it('creates a new user', done => {
        request.post('/users')
          .set('Authorization', `jwt ${token}`)
          .send({
            name: 'doe',
            email: 'doe@example.com',
            password: '123456'
          })
          .expect(200)
          .end((err, res) => {
            expect(res.body.email).to.eql('doe@example.com');
            done(err);
          });
      });
    });
  });
});
