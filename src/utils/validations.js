// src/utils/validations.js
exports.isUUID = (s) => /^[0-9a-fA-F-]{36}$/.test(s);
exports.requireFields = (obj, fields) => {
  for (const f of fields) {
    if (obj[f] === undefined || obj[f] === null) return f;
  }
  return null;
};
