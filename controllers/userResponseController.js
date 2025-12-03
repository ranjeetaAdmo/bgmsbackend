const userResponseService = require('../services/userResponseService');

exports.saveResponses = async (req, res) => {
  const { responses } = req.body;

  // user id from JWT token (cookie)
  const userId = req.user.userId;

  if (!Array.isArray(responses)) {
    return res.status(400).json({ success: false, message: 'Responses array is missing' });
  }

  try {
    await userResponseService.saveResponses(userId, responses);
    res.json({ success: true, message: 'Responses saved successfully' });
  } catch (err) {
    console.error("Save response error:", err);
    res.status(500).json({ success: false, message: 'Failed to save responses' });
  }
};

exports.getUserResponses = async (req, res) => {
  const { user_id } = req.params;
  try {
    const data = await userResponseService.getUserResponses(user_id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch responses' });
  }
};