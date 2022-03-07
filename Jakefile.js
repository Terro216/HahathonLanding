let exec = require('child_process').execSync;
let fs = require('fs');

desc('Build project.');
task('default', function () {
  // Build back
  exec('cd ./HahathonLanding-Back && npm ci && cd ..');

  // Build front
  exec('cd ./HahathonLanding-Front && npm ci && npm run build && cd ..');
  jake.cpR('./HahathonLanding-Front/dist', './HahathonLanding-Back/src');
  fs.renameSync('./HahathonLanding-Back/src/dist', './HahathonLanding-Back/src/static');
  jake.cpR('./HahathonLanding-Back', './app');
});
