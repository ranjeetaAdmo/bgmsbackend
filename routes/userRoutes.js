const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const categoryController = require('../controllers/categoryController');
const questionController = require("../controllers/questionController");
const ContactController = require('../controllers/contactController');
const contactController = new ContactController(); // <-- Add this line
const userResponseController = require('../controllers/userResponseController');

// Auth
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post("/contact", contactController.createContact.bind(contactController));
router.post("/forgetpassword", authController.forgetPassword);
router.post("/resetpassword", authController.resetPassword);
router.post("/logout", authController.logout);
// router.get("/me", authController.getCurrentUser);
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
router.get("/auth/check", authMiddleware, (req, res) => {
  res.json({
    loggedIn: true,
    user: req.user,
  });
});
router.use(authMiddleware); 


// Users
router.get('/users', adminMiddleware, userController.getAllUsers);
router.post('/editUser',adminMiddleware, userController.editUser);
router.post('/deleteUser', adminMiddleware, userController.deleteUser);
//category
router.post('/saveCategory', adminMiddleware, categoryController.addCategory);
router.get("/categories", categoryController.getCategory);
router.post("/editCategory", adminMiddleware, categoryController.editCategory);
router.post("/deleteCategory", adminMiddleware, categoryController.deleteCategory);
//questions
router.post("/addQuestions", adminMiddleware, questionController.addQuestion);
router.get("/getQuestions", questionController.getQuestion);
router.post("/editQuestion", adminMiddleware, questionController.editQuestion);
router.post("/deletequestion", adminMiddleware, questionController.deleteQuestion);
router.get("/getQuestionById/:id",adminMiddleware, questionController.getQuestionById);
router.get("/contacts", adminMiddleware, contactController.getContacts.bind(contactController));
//responses
router.post('/saveResponse', userResponseController.saveResponses);
router.get('/userResponses/:user_id', adminMiddleware, userResponseController.getUserResponses);

module.exports = router;
