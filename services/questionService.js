const db = require('../config/db');

exports.addQuestion = (categoryId, questionText, options, correctAnswerIndex) => {
  return new Promise((resolve, reject) => {
    // Build query for flattened schema
    const sql = `
      INSERT INTO questions 
        (category_id, text, option1, option2, option3, option4, correct_option,status) 
      VALUES (?, ?, ?, ?, ?, ?, ?,1)
    `;

    const values = [
      categoryId,
      questionText,
      options[0],
      options[1],
      options[2],
      options[3],
      (correctAnswerIndex + 1).toString() // convert 0 → "1", 1 → "2" etc.
    ];

    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve({ questionId: result.insertId });
    });
  });
};

exports.getQuestions = () => {
 return new Promise((resolve, reject) => {
    const sql = 'SELECT q.id , q.text as question_text, q.created_at, c.category_name FROM questions q JOIN category c On q.category_id=c.id WHERE q.status=1';
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.editQuestion = (id, categoryId, questionText, options, correctAnswerIndex) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE questions 
      SET category_id = ?, text = ?, option1 = ?, option2 = ?, option3 = ?, option4 = ?, correct_option = ? 
      WHERE id = ? AND status = 1
    `;
    const values = [
      categoryId,
      questionText, 
      options[0],
      options[1],
      options[2],
      options[3],
      (correctAnswerIndex + 1).toString(),
      id
    ];

    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

exports.deleteQuestion = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE questions SET status = 0 WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

exports.getQuestionById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
       *
      FROM questions
      WHERE id = ? AND status = 1
    `;
    db.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); // return single row
    });
  });
};
