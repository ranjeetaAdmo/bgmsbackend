const userService = require('../services/userService');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    return res.status(200).json({
      success: true,
      status_code: 200,
      data: users,
      message: "Users fetched successfully"
    });
  } catch (err) {
    console.error("GetAllUsers error:", err);

    return res.status(500).json({
      success: false,
      status_code: 500,
      data: [],
      message: "Server error"
    });
  }
};

exports.editUser = async (req, res) => {
  const { id, fullname, email } = req.body; // Ensure id is included in the request body

  if (!id || !fullname || !email) {
    return res.status(400).json({ message: "Please provide id, fullname, and email" });
  }     
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  try {
    const affectedRows = await userService.editUser(id, fullname, email); 
    if (affectedRows === 0) {
      return res.status(404).json({ message: "User not found or no changes made" });
    }
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("EditUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.body; 

  if (!id) {
    return res.status(400).json({ message: "Please provide id" });
  }   

  try {
    const affectedRows = await userService.deleteUser(id); 
    
    if (affectedRows === 0) {
      return res.status(404).json({ message: "User not found or no changes made" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Server error" });
  } 
};

