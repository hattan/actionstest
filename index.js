 
const core = require('@actions/core')
const { Toolkit } = require('actions-toolkit')

Toolkit.run(async tools => {
  try {
    if(!tools.context.payload.pull_request){
        tools.log.warn('Not a pull request skipping verification!');
        return;
    }

    tools.log.debug('Starting Pull Request Verification!');
    verifyLinkedIssue(tools);
    
  } catch (err) {
    tools.log.error(`An error occurred while creating the issue.`)
    tools.log.error(err)

    if (err.errors) tools.log.error(err.errors)

    core.setFailed(errorMessage + '\n\n' + err.message)
    tools.exit.failure()
  }
}, {
  secrets: ['GITHUB_TOKEN']
});

function verifyLinkedIssue(tools) {
  const context = tools.context,
        github  = tools.github;
        
  const linkedIssue = checkBodyForValidIssue(context,github);

  if (!linkedIssue) {
    linkedIssue = checkEventsListForConnectedEvent(context,github);
  }

  if(linkedIssue){
      tools.log.success("Success! Linked Issue Found!");
  }
  else{
      createMissingIssueComment(context,github);
      tools.log.error("No Linked Issue Found!");
      core.setFailed("No Linked Issue Found!");
      tools.exit.failure() 
  }
}

async function checkBodyForValidIssue(context,github){
  let body = context.payload.pull_request.body;
  const re = /#(.*?)[\s]/g;
  const matches = body.match(re);
  if(matches){
    matches.forEach(match => {
      var issueId = match.replace('#','').trim();
      let issue = github.issues.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueId,
      });
      if(issue){
        return true;
      }
    });
  }
  return false;
}

async function checkEventsListForConnectedEvent(context, github){
  let pull = await github.issues.listEvents({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.payload.pull_request.number 
  });

  if(pull.data){
    pull.data.forEach(item => {
      if (item.event == "connected"){
        return true;
      }
    });
  }
  return false;
}

async function createMissingIssueComment(context,github) {
  await github.issues.createComment({
    issue_number: context.payload.pull_request.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: 'Build Error! No Linked Issue found. Please link an issue or mention it in the body using #<issue_id>'
  });
}
