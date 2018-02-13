var BrowserStack = require("browserstack");

var username = process.env.BROWSERSTACK_USERNAME;
var password = process.env.BROWSERSTACK_KEY;

if (!username || !password) {
  throw new Error("Please set BROWSERSTACK_USERNAME and BROWSERSTACK_KEY environment variables.");
}

var client = BrowserStack.createScreenshotClient({
  username: username,
  password: password
});

// client.getBrowsers(function(err, browsers) {

//   browsers.map(util.validateBrowserObject);

// });

console.log("should generate screenshots for multiple browsers");
var options = {
  url: "https://www.getpostman.com/postman",
  browsers: ["40.0", "41.0", "42.0"].map(function(v) {
    return {
      os: "Windows",
      os_version: "7",
      browser: "chrome",
      browser_version: v
    };
  })
};

client.generateScreenshots(options, function(err, job) {

  console.log('Job init:: ', job);

  if (err) {
    console.warn("\t[WARN] worker %s did not run within timeout", job.job_id);
  } else {
    pullJob(job.job_id, 30, 3000);
  }
});

function pullJob(id, maxRetries, waitTime) {
  maxRetries && client.getJob(id, function(err, job) {
    if (job.state === "done") {
      console.log('DONE:: ', job);
      return;
    } else {
      setTimeout(function() {
        pullJob(id, --maxRetries, waitTime);
      }, waitTime);
    }
  });
}
