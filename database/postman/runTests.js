const newman = require("newman");

newman.run(
  {
    collection: require("./tests.postman_collection.json"),
    iterationCount: 1,
    reporters: "cli",
  },
  function (err) {
    if (err) {
      throw err;
    }
    console.log("collection run complete!");
  }
);
