describe('Routes: Token', () => {
  const Users = app.db.models.Users;

  describe('POST /token', () => {
    const email = 'john@example.com';
    const password = '123456';

    beforeEach(done => {
      Users.destroy({where: {}})
        .then(() => Users.create({
          name: 'John',
          email,
          password
        }))
        .then(() => done());
    });

    describe('status 200', () => {
      it('returns authenticated user token', done => {
        const credential = {email, password};
        request.post('/token')
          .send(credential)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.include.keys('token');
            done(err);
          });
      });
    });

    describe('status 401', () => {
      it('throws error when password is incorrect', done => {
        const credential = {email, password: 'wrong_password'};
        request.post('/token')
          .send(credential)
          .expect(401)
          .end((err, res) => {
            done(err);
          });
      });

      it('throws error when email not exist', done => {
        const credential = {email: 'wrong_email@example.com', password};
        request.post('/token')
          .send(credential)
          .expect(401)
          .end((err, res) => {
            done(err);
          });
      });

      it('throws error when email and password are blank', done => {
        request.post('/token')
          .expect(401)
          .end((err, res) => {
            done(err);
          });
      });
    });
  });
});
