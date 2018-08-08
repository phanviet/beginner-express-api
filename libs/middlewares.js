import express from 'express';

module.exports = app => {
  app.set('port', 3000);
  app.set('json space', 2);
  app.use(express.json());
  app.use(app.auth.initialize());
  app.use((req, res, next) => {
    if (req.body.id) {
      delete(req.body.id);
    }
    next();
  });
  app.use(express.static('public'));
};
