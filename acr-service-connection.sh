# JSON_STRING=$( jq -n \
#                   --arg acr_server "${acr_server}" \
#                   --arg ROLE_ID "${ROLE_ID}" \
#                   --arg tenantId "${tenantId}" \
#                   --arg acr_id "${acr_id}" \
#                   --arg subscriptionId "${subscriptionId}" \
#                   --arg subscriptionName "${subscriptionName}" \
#                   --arg acr_name "${acr_name}" \
#                   '' )
# acr_config = "{ authorization: { scheme: \"ServicePrincipal\", parameters: { loginServer: \"${acr_server}\", role:  \"${ROLE_ID}\", scope: \"${acr_id}\", servicePrincipalId: \"<placeholder>\", tenantId:  \"${tenantId}\" } }, data: { appObjectId: \"\", azureSpnPermissions: \"\", azureSpnRoleAssignmentId: \"\", registryId: \"${acr_id}\", registrytype: \"ACR\", spnObjectId: \"\", subscriptionId: \"${subscriptionId}\", subscriptionName: \"${subscriptionName}\" }, description: \"\", groupScopeId: null, name: \"lasttry1\", operationStatus: null, readersGroup: null, serviceEndpointProjectReferences: null, type: \"dockerregistry\", url: \"https://\"${acr_name}\".azurecr.io\", isShared: false, owner: \"library\" }"
echo "{ \"authorization\": { \"scheme\": \"ServicePrincipal\", \"parameters\": { \"loginServer\": \"${acr_server}\", \"role\":  \"${ROLE_ID}\", \"scope\": \"${acr_id}\", \"servicePrincipalId\": \"<placeholder>\", \"tenantId\":  \"${tenantId}\" } }, \"data\": { \"appObjectId\": \"\", \"azureSpnPermissions\": \"\", \"azureSpnRoleAssignmentId\": \"\", \"registryId\": \"${acr_id}\", \"registrytype\": \"ACR\", \"spnObjectId\": \"\", \"subscriptionId\": \"${subscriptionId}\", \"subscriptionName\": \"${subscriptionName}\" }, \"description\": \"\", \"groupScopeId\": null, \"name\": \"${dockerServiceConnection}\", \"operationStatus\": null, \"readersGroup\": null, \"serviceEndpointProjectReferences\": null, \"type\": \"dockerregistry\", \"url\": \"https://${acr_name}.azurecr.io\", \"isShared\": false, \"owner\": \"library\" }" > acr-config-new.json
az devops service-endpoint create --service-endpoint acr-config-new.json --organization ${organization} --project ${projectName}