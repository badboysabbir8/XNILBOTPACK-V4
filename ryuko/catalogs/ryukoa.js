console.clear();
const { spawn } = require("child_process");
const express = require("express");
const app = express();
const chalk = require("chalk");
const logger = require("./ryuko/catalogs/ryukoc.js");
const path = require("path");

const PORT = process.env.PORT || 8080;

global.countRestart = 0;

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./website/ryuko.html"));
});

function startBot(message) {
  if (message) logger(message, "starting");

  console.log(chalk.blue("DEPLOYING MAIN SYSTEM"));
  logger.loader(`Deploying app on port ${chalk.blueBright(PORT)}`);

  app.listen(PORT, () => {
    logger.loader(`App deployed on port ${chalk.blueBright(PORT)}`);
  });

  const child = spawn(
    "node",
    ["--trace-warnings", "--async-stack-traces", "ryukob.js"],
    {
      cwd: __dirname,
      stdio: "inherit",
      shell: true,
    }
  );

  child.on("close", (codeExit) => {
    if (codeExit !== 0 && global.countRestart < 5) {
      global.countRestart += 1;
      logger(`Restarting bot (attempt ${global.countRestart})`, "warning");
      startBot();
    } else if (codeExit !== 0) {
      logger("Bot failed to restart after 5 attempts", "error");
    }
  });

  child.on("error", function (error) {
    logger(`An error occurred: ${JSON.stringify(error)}`, "error");
  });
}

startBot();
