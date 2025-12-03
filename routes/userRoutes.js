const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const categoryController = require('../controllers/categoryController');
const questionController = require("../controllers/questionController");
const ContactController = require('../controllers/contactController');
const contactController = new ContactController(); // <-- Add this line
const userResponseController = require('../controllers/userResponseController');

// Auth
router.post('/register', authController.register);
router.post('/login', authController.login);
// router.get("/me", authController.getCurrentUser);
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
router.post("/logout", authController.logout);
router.post("/forgetpassword", authController.forgetPassword);
router.post("/resetpassword", authController.resetPassword);

// Users
router.get('/users', authMiddleware, userController.getAllUsers);
router.post('/editUser', userController.editUser);
router.post('/deleteUser', userController.deleteUser);
//category
router.post('/saveCategory', categoryController.addCategory);
router.get("/categories", categoryController.getCategory);
router.post("/editCategory", categoryController.editCategory);
router.post("/deleteCategory", categoryController.deleteCategory);
//questions
router.post("/addQuestions", questionController.addQuestion);
router.get("/getQuestions", questionController.getQuestion);
router.post("/editQuestion", questionController.editQuestion);
router.post("/deletequestion", questionController.deleteQuestion);
router.get("/getQuestionById/:id", questionController.getQuestionById);
router.post("/contact", contactController.createContact.bind(contactController));
router.get("/contacts", contactController.getContacts.bind(contactController));
//responses
router.post('/saveResponse', userResponseController.saveResponses);
router.get('/userResponses/:user_id', userResponseController.getUserResponses);

module.exports = router;
