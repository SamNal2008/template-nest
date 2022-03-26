export default () => ({
  app: {
    port: process.env.PORT|| 3000,
    node_env: process.env.NODE_ENV || 'development' 
  }
});