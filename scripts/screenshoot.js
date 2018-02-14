fs = require('fs');
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

console.log("should generate screenshots for multiple browsers");
var options = {
  url: "http://new-homepage.www.getpostman-beta.com",
  wait_time: 10,
  browsers: [
    {
      "os": "Windows",
      "os_version": "7",
      "browser": "ie",
      "browser_version": "9.0"
    },
    {
      "os": "Windows",
      "os_version": "7",
      "browser": "ie",
      "browser_version": "9.0"
    },
    {
      "os": "Windows",
      "os_version": "7",
      "browser": "firefox",
      "browser_version": "34.0"
    },
    {
      "os": "OS X",
      "os_version": "El Capitan",
      "browser": "chrome",
      "browser_version": "42.0"
    },
    {
      "os": "ios",
      "os_version": "6.0",
      "device": "iPhone 5"
    },
    {
      "os": "android",
      "os_version": "5.0",
      "device": "Google Nexus 6"
    }
  ]
};

client.generateScreenshots(options, function(err, job) {

  console.log('Job init:: ', job);

  if (err) {
    console.warn(err);
  } else {
    pullJob(job.job_id, 60, 3000);
  }
});

function pullJob(id, maxRetries, waitTime) {
  if (maxRetries) {
    client.getJob(id, function(err, job) {
      if (job.state === "done") {
        console.log('DONE:: ', job);

        // var imageArr = [];
        // job.screenshots.forEach(i => {
        //   imageArr.push(i.thumb_url);
        // });
        // Write updated data to file
        file = "./index.html";
        fs.readFile(file, 'utf8', (e, data) => {
          data = data.replace(/\[.*\]/, JSON.stringify(job.screenshots));
          fs.writeFile(file, data, 'utf8', console.log.bind(null, `Updated index.html with screenshots`));
        });
        return;
      } else {
        setTimeout(function() {
          pullJob(id, --maxRetries, waitTime);
        }, waitTime);
      }
    });
  } else {
    console.warn("Timeout...Job isn't done.");
  }
}
