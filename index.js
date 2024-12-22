const { spawn } = require("child_process");
const path = require("path");

// Script path
const scriptPath = path.join(__dirname, "ryuko/catalogs/ryukoa.js");

// Spawn child process to run the script
const child = spawn("node", [scriptPath], {
  stdio: "inherit", // Inherit standard input/output
  shell: true, // Allow shell syntax
});

// Handle errors
child.on("error", (error) => {
  console.error("An error occurred:", error);
});

// Handle script close
child.on("close", (code) => {
  console.log(`Process exited with code: ${code}`);
});
