

/**
 * Log an action to the database
 * @param {number} userId - User ID performing the action
 * @param {string} actionType - Type of action (LOGIN, LOGOUT, ADD_USER, DOWNLOAD, SEARCH)
 * @param {string} description - Description of the action
 * @param {string} ipAddress - IP address of the user
 */
async function logAction(userId, actionType, description, ipAddress) {
  try {
    await pool.query(
      'INSERT INTO logs (user_id, action_type, action_description, ip_address) VALUES ($1, $2, $3, $4)',
      [userId, actionType, description, ipAddress]
    );
    console.log(`Logged action: ${actionType} for user ${userId}`);
  } catch (error) {
    console.error('Error logging action:', error);
  }
}

module.exports = { logAction };