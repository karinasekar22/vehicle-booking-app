const { Log } = require('../models');

const logAction = async (user_id, action, target_id) => {
  try {
    await Log.create({
      user_id,
      action,
      target_id,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Failed to log action:', err);
  }
};

module.exports = logAction;
