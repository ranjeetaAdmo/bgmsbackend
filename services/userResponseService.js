const db = require('../config/db');

exports.saveResponses = (user_id, responses) => {
  // responses: [{ question_id, selected_option }]
  return Promise.all(
    responses.map(resp =>
      new Promise((resolve, reject) => {
        const sql = `INSERT INTO userresponse (user_id, question_id, selected_option) VALUES (?, ?, ?)`;
        db.query(sql, [user_id, resp.question_id, resp.selected_option], (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        });
      })
    )
  );
};

exports.getUserResponses = (user_id) => {
  return new Promise((resolve, reject) => {

    const sql = `
      SELECT 
          u.id AS user_id,
          u.fullname AS user_name,
          u.email AS user_email,

          c.id AS category_id,
          c.category_name,

          q.id AS question_id,
          q.text AS question_text,

          CASE ur.selected_option
              WHEN 'option1' THEN q.option1
              WHEN 'option2' THEN q.option2
              WHEN 'option3' THEN q.option3
              WHEN 'option4' THEN q.option4
          END AS user_selected_value

      FROM userresponse ur
      JOIN users u ON ur.user_id = u.id
      JOIN questions q ON ur.question_id = q.id
      JOIN category c ON q.category_id = c.id
      WHERE ur.user_id = ?
      ORDER BY c.id, q.id
    `;

    db.query(sql, [user_id], (err, results) => {
      if (err) return reject(err);

      if (results.length === 0) {
        return resolve({ success: false, message: "No data found" });
      }

      // ---- Build Final Response Format ----
      const user = {
        id: results[0].user_id,
        name: results[0].user_name,
        email: results[0].user_email
      };

      const categories = {};

      results.forEach(row => {
        if (!categories[row.category_id]) {
          categories[row.category_id] = {
            category_id: row.category_id,
            category_name: row.category_name,
            questions: []
          };
        }

        categories[row.category_id].questions.push({
          question_id: row.question_id,
          question_text: row.question_text,
          user_selected: row.user_selected_value
        });
      });

      resolve({
        success: true,
        user,
        categories: Object.values(categories)
      });
    });
  });
};