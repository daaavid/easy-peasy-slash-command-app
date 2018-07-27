const db = require("./db");

module.exports = (queryString, values) =>
  new Promise((resolve, reject) => {
    console.log(queryString, values);

    db().query(queryString, values, (err, result) => {
      if (err || !result.length) {
        return reject(err || "no results");
      }

      const [first] = result;
      return resolve(first);
    });
  });
