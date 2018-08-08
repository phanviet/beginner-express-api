module.exports = {
  database: 'ntask',
  username: '',
  password: '',
  params: {
    dialect: 'sqlite',
    storage: 'ntask.sqlite',
    define: {
      underscored: true
    }
  },
  jwtSecret: "NTask$",
  jwtSession: {session: false}
};
