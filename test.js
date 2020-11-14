const tw = require('teamwork-api')('chess987soccer', 'https://vatrox.teamwork.com', custom_domain=true)

var projects = tw.projects.get()

console.log(projects)

