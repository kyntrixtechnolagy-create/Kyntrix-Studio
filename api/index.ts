module.exports = (req, res) => {
  try {
    const app = require('../backend/src/app').default;
    return app(req, res);
  } catch (err) {
    res.status(500).json({ error: 'BOOT ERROR', message: err.message, stack: err.stack });
  }
};
