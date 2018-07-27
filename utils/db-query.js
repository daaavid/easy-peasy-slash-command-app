const db = require("./db");

module.exports = (queryString, values) =>
  new Promise((resolve, reject) => {
    db().query(queryString, values, result => {
      if (err || !result.length) {
        return reject(err || "no results");
      }

      const [first] = result;
      return resolve(first);
    });
  });
