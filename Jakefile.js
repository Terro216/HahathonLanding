let exec = require('child_process').execSync;
let fs = require('fs');

// desc('Builds back');
// task('buildBack', function () {
//   return new Promise((resolve, reject) => {
//     exec(`cd ./HahathonLanding-Back && npm ci && npm run build`, (err, stdout, stderr) => {
//       if (err) {
//         console.error(stderr);
//         reject(stderr);
//       }
//
//       console.log(stdout);
//       resolve(true);
//     });
//   });
// });

desc('Build project.');
task('default', function () {
  exec('cd ./HahathonLanding-Back && npm ci && cd ..');

  // fs.mkdirSync('./HahathonLanding-Back/src/static');

  exec('cd ./HahathonLanding-Front && npm ci && npm run build && cd ..');
  jake.cpR('./HahathonLanding-Front/dist', './HahathonLanding-Back/src');
  fs.renameSync('./HahathonLanding-Back/src/dist', './HahathonLanding-Back/src/static');
  jake.cpR('./HahathonLanding-Back', './app');
});
