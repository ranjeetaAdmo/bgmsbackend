const userResponseService = require('../services/userResponseService');

exports.saveResponses = async (req, res) => {
  const { user_id, responses } = req.body;
  if (!user_id || !Array.isArray(responses)) {
    return res.status(400).json({ success: false, message: 'Missing user_id or responses' });
  }
  try {
    await userResponseService.saveResponses(user_id, responses);
    res.json({ success: true, message: 'Responses saved successfully' });
  } catch (err) {
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