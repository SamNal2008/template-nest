export default (): any => ({
  app: {
    port: process.env.PORT || 3000,
    node_env: process.env.NODE_ENV || 'development',
    documentation: {
      title: process.env.DOC_TITLE,
      description: process.env.DOC_DESC,
      version: process.env.DOC_VERSION,
    },
    logLevel: process.env.LOG_LEVEL
  },
  database: {
    url: process.env.DATABASE_URL,
  },
});
