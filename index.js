const core = require('@actions/core');
const github = require('@actions/github');

async function createComment(text){
    console.log(github);
    await github.issues.createComment({
        issue_number: '30',
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        body: text
      }) 
}

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

  createComment("test");


} catch (error) {
  core.setFailed(error.message);
}