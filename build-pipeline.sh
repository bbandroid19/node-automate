#!/bin/bash
az devops configure --defaults organization=${organization} project=${projectName}


az pipelines folder create --path ${pipeline_folder} --project ${projectName} --org ${organization}

az pipelines  create --folder-path ${pipeline_folder}  --name "${pipeline_name}" --description "${pipeline_description}" --repository "${github_repo_url}" --branch master --org $organization --project "${projectName}" --yml-path azure-pipelines.yml --service-connection ${github_service_connection_id}

