module.exports = {
  apps: [
    {
      name: 'emailApp',
      script: 'dist/src/app.js',
      node_args: '--max-old-space-size=4096',
    },
  ],
};
