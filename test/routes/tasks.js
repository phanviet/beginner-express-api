import jwt from 'jwt-simple';

describe('Routes: Tasks', () => {
  const Users = app.db.models.Users;
  const Tasks = app.db.models.Tasks;
  const jwtSecret = app.libs.config.jwtSecret;
  let token;
  let fakeTask;

  beforeEach(done => {
    Users.destroy({where: {}})
      .then(() => {
        return Users.create({
          name: 'john',
          email: 'john@example.com',
          password: '123456'
        });
      })
      .then(user => {
        Tasks.destroy({where: {}})
          .then(() => {
            return Tasks.bulkCreate([{
              title: 'work',
              user_id: user.id
            }, {
              title: 'study',
              user_id: user.id
            }]);
          })
          .then(tasks => {
            fakeTask = tasks[0];
            token = jwt.encode({id: user.id}, jwtSecret);
            done();
          });
      });
  });

  describe('GET /tasks', () => {
    describe('status 200', () => {
      it('returns a list of tasks', done => {
        request.get('/tasks')
          .set('Authorization', `jwt ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.have.length(2);
            expect(res.body[0].title).to.eql('work');
            expect(res.body[1].title).to.eql('study');
            done(err);
          });
      });
    });
  });

  describe('POST /tasks', () => {
    describe('status 200', () => {
      it('creates a new task', done => {
        request.post('/tasks')
          .set('Authorization', `jwt ${token}`)
          .send({title: 'run'})
          .expect(200)
          .end((err, res) => {
            expect(res.body.title).to.eql('run');
            expect(res.body.done).to.be.false;
            done(err);
          });
      });
    });
  });

  describe('GET /tasks/:id', () => {
    describe('status 200', () => {
      it('returns one task', done => {
        request.get(`/tasks/${fakeTask.id}`)
          .set('Authorization', `jwt ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.title).to.eql('work');
            done(err);
          });
      });
    });

    describe('status 404', () => {
      it('throws error when task not exist', done => {
        request.get('/tasks/-1')
          .set('Authorization', `jwt ${token}`)
          .expect(404)
          .end((err, res) => done(err));
      });
    });
  });

  describe('PUT /tasks/:id', () => {
    describe('status 200', () => {
      it('updates a task', done => {
        request.put(`/tasks/${fakeTask.id}`)
          .set('Authorization', `jwt ${token}`)
          .send({title: 'travel', done: true})
          .expect(200)
          .end((err, res) => {
            done(err);
          });
      });
    });
  });

  describe('DELETE /tasks/:id', () => {
    describe('status 204', () => {
      it('removes a task', done => {
        request.delete(`/tasks/${fakeTask.id}`)
          .set('Authorization', `jwt ${token}`)
          .expect(204)
          .end((err, res) => done(err));
      });
    });
  });
});
