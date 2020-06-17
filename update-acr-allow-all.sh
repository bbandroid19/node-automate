echo ${acr_service_id}
az devops service-endpoint update --id ${acr_service_id}  --enable-for-all --project "${projectName}"