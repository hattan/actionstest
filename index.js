 
const core = require('@actions/core')
const { Toolkit } = require('actions-toolkit')

Toolkit.run(async tools => {
  // Get the file
  tools.log.debug('Initialize test')

  // Create the new issue
  try {
    let comment = await tools.github.issues.createComment({
        issue_number: '30',
        owner: tools.context.repo.owner,
        repo: tools.context.repo.repo,
        body: 'test'
    }) 
    


   
    tools.log.success(`Created comment ${comment}`)
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