const db = require("./db");

module.exports = (queryString, values, returnResults = false) =>
  new Promise((resolve, reject) => {
    console.log(queryString, values);

    db().query(queryString, values, (err, result) => {
      if (returnResults) {
        if (err || !result.length) {
          return reject(err || "no results");
        }

        const [first] = result;
        return resolve(first);
      } else if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
