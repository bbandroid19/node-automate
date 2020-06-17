export AZURE_DEVOPS_EXT_GITHUB_PAT=${github_pat}


az devops service-endpoint github create --github-url ${github_repo_url} --project ${projectName} --org ${organization} --name ${git_service_connection_name}