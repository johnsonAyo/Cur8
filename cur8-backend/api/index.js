let appHandler;
try {
  const mod = require('../dist/main');
  appHandler = mod.default || mod;
} catch (e) {
  console.error("Failed to require ../dist/main:", e);
  console.error("Path resolve check:", __dirname);
  // Keep the stack trace
  appHandler = (req, res) => {
    res.statusCode = 500;
    res.end(JSON.stringify({
      error: "Failed to require ../dist/main",
      message: e.message,
      stack: e.stack,
      dir: __dirname
    }));
  };
}

module.exports = (req, res) => {
  return appHandler(req, res);
};
