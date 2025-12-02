const db = require('../config/db');
const Contact = require('../models/contactModel');

exports.createContact = ({ name, email, phone, message }) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO ${Contact.table} (name, email, phone, message) VALUES (?, ?, ?, ?)`;
    db.query(sql, [name, email, phone, message], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

exports.getContacts = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ${Contact.table}`;
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.getContactById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ${Contact.table} WHERE id = ?`;
    db.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

exports.updateContact = (id, { name, email, phone, message }) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE ${Contact.table} SET name = ?, email = ?, phone = ?, message = ? WHERE id = ?`;
    db.query(sql, [name, email, phone, message, id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

exports.deleteContact = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM ${Contact.table} WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};