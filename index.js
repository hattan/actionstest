 
const core = require('@actions/core')
const { Toolkit } = require('actions-toolkit')

Toolkit.run(async tools => {
  
  try {
    if(!context.payload.pull_request){
        tools.log.warn('Not a pull request skipping verification!');
        return;
    }
    tools.log.debug('Starting Pull Request Verification!');

    let isLinked=false;
    let invalidIssue=false;
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
                isLinked = true;
                invalidIssue=true;
            }
        });
    }

    if(!isLinked){
        let pull = await tools.github.issues.listEvents({
        owner: tools.context.repo.owner,
        repo: tools.context.repo.repo,
        issue_number: tools.context.payload.pull_request.number 
        });
        if(pull.data){
        pull.data.forEach(item => {
            if (item.event == "connected"){
            isLinked = true;
            }
        });
        }
    }

    if(isLinked){
        tools.log.success("Success! Linked Issue Found!");
    }
    else{
        await github.issues.createComment({
            issue_number: context.payload.pull_request.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: 'Build Error! No Linked Issue found. Please link an issue or mention it in the body using #<issue_id>'
        });
        tools.log.error("No Linked Issue Found!");
        core.setFailed("No Linked Issue Found!");
        tools.exit.failure() 
    }
  } catch (err) {
    // Log the error message
    const errorMessage = `An error occurred while creating the issue. This might be caused by a malformed issue title, or a typo in the labels or assignees. Check ${template}!`
    tools.log.error(errorMessage)
    tools.log.error(err)

    // The error might have more details
    if (err.errors) tools.log.error(err.errors)

    // Exit with a failing status
    core.setFailed(errorMessage + '\n\n' + err.message)
    tools.exit.failure()
  }
}, {
  secrets: ['GITHUB_TOKEN']
})