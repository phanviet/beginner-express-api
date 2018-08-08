module.exports = app => {
  const Users = app.db.models.Users;

  /**
   * @api {get} /user Return the authenticated user's data
   * @apiGroup User
   * @apiHeader {String} Authorization Token of authenticated user
   * @apiHeaderExample {json} Header
   *  {"Authorization": "jwt xyz.abc.123"}
   * @apiSuccess {Number} id User id
   * @apiSuccess {String} email User email
   * @apiSuccess {String} name User name
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 OK
   *  {
   *    "id": 1,
   *    "name": "john",
   *    "email": "john@example.com"
   *  }
   * @apiErrorExample {json} Find error
   *  HTTP/1.1 412 Precondition Failed
   */
  const getUserHandler = (req, res) => {
    Users.findById(req.user.id, {
      attributes: ['id', 'name', 'email']
    }).then(users => res.json(users))
      .catch(error => res.status(412).json({msg: error.message}));
  };

  /**
   * @api {delete} /user Deletes an authenticated user
   * @apiGroup User
   * @apiHeader {String} Authorization Token of authenticated user
   * @apiHeaderExample {json} Header
   *  {"Authorization": "jwt abc.xyz.123"}
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 204 No Content
   * @apiErrorExample {json} Delete error
   *  HTTP/1.1 412 Precondition Failed
   */
  const deleteUserHandler = (req, res) => {
    Users.destroy({where: {id: req.user.id}})
      .then(result => res.sendStatus(204))
      .catch(error => res.status(412).json({msg: error.message}));
  };

  /**
   * @api {post} /users Register a new user
   * @apiGroup User
   * @apiParam {String} name User name
   * @apiParam {String} email User email
   * @apiParam {String} password User password
   * @apiParamExample {json} Input
   *  {
   *    "name": "john",
   *    "email": "john@example.com",
   *    "password": "123456"
   *  }
   * @apiSuccess {Number} id User id
   * @apiSuccess {String} name User name
   * @apiSuccess {String} email User email
   * @apiSuccess {String} password User encrypted password
   * @apiSuccess {Date} created_at User Register date
   * @apiSuccess {Date} updated_at User Updated date
   * @apiSuccessExample {json} Success
   *  HTTP/1.1 200 OK
   *  {
   *    "id": 1,
   *    "name": "john",
   *    "password": "$#@$dfssdfsfsd",
   *    "email": "john@example.com",
   *    "created_at": "2018-02-10T15:20:11.100Z"
   *    "updated_at": "2018-02-10T16:20:11.100Z"
   *  }
   * @apiErrorExample {json} Register error
   *  HTTP/1.1 412 Precondition Failed
   */
  const createUserHandler = (req, res) => {
    Users.create(req.body)
      .then(user => res.json(user))
      .catch(error => res.status(412).json({msg: error.message}));
  };

  app.route('/user')
    .all(app.auth.authenticate())
    .get(getUserHandler)
    .delete(deleteUserHandler);

  app.post('/users', createUserHandler);
};
