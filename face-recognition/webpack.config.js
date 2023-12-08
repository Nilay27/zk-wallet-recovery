// Using CommonJS syntax
module.exports = {
    // ... other configurations ...
    resolve: {
      fallback: {
        buffer: require.resolve('buffer/'),
      },
    },
    // ... other configurations ...
  };
  