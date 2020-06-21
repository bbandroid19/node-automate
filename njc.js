'use strict';


const webSocketsServerPort = 3000;
const webSocketServer = require('websocket').server;
const http = require('http');
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server
})

const clients = {};
// I'm maintaining all active users in this object
const users = {};

const sendMessage = (json) => {
  // We are sending the current data to all connected clients
  Object.keys(clients).map((client) => {
  console.log(client);
    clients[client].sendUTF(json);
  });
}
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

const startProcess =(data) =>{
console.log(data)
const { exec } = require("child_process");
  var env = Object.create(process.env);
  env.username = data.username;
  env.password = data.password;
  env.organization = data.organization;
  env.projectName = data.projectName;
  env.projectDescription = data.projectDescription;
  env.pipeline_folder = data.pipeline_folder;
  env.pipeline_name = data.pipeline_name;
  env.pipeline_description = data.pipeline_description;
  env.git_service_connection_name = data.git_service_connection_name;
  env.github_repo_url = 'https://github.com/bbandroid19/azure-automate';
  env.github_pat = 'ad498e2c942aae44b29f08fa1648cd0dfddd10b7';
  env.location = "eastus";
  env.resource_group_name = data.resource_group_name
  env.azure_container_registry_name = data.azure_container_registry_name;
  env.dockerServiceConnection = data.dockerServiceConnection;
  env.containerRepository = data.containerRepository;
  env.ROLE_ID = "8311e382-0749-4cb8-b61a-304f252e45ec";

  var az_login = exec("sh az-login.sh", { env: env }, (error, stdout, stderr) => {
      console.log(error);
      sendMessage('1');
      exec("sh account-show.sh", { env: env }, (std_acc_err, std_acc_out, std_acc_errObj) => {
          console.log(std_acc_err);
          sendMessage('Azure account show success');
          var accountInfo = JSON.parse(std_acc_out);
          env.subscriptionId = accountInfo.id;
          env.tenantId = accountInfo.tenantId;
          env.subscriptionName = accountInfo.name;
      })
      exec("sh rg-create.sh", { env: env }, (sd_rgc_err, std_rgc_out, std_rgc_errObj) => {
        sendMessage('2');
          exec("sh acr-create.sh", { env: env }, (std_acr_err, std_acr_out, std_acr_errObj) => {
              console.log(std_acr_err);
              sendMessage('3');
              exec("sh get-acr-id.sh", { env: env }, (std_gacrid_err, std_gacrid_out, std_gacriderrObj) => {
                  console.log(std_gacrid_err)
                  var gacridObj = JSON.parse(std_gacrid_out);
                  env.acr_id = gacridObj.id;
                  env.acr_server = gacridObj.loginServer;
                  env.acr_name = gacridObj.name;
                  exec("sh az-devops-create.sh", { env: env }, (devopsErr, devopsOut, dvpsErr) => {
                      console.log(devopsOut);
                        sendMessage('4');
                      exec("sh acr-service-connection.sh", { env: env }, (std_acrsc_err, std_acrsc_out, std_acrsc_errObj) => {
                          console.log(std_acrsc_err);
                          console.log(std_acrsc_out);
                          var acr_service_connectObj = JSON.parse(std_acrsc_out)
                          env.acr_service_id = acr_service_connectObj.id;
                          console.log("Service id begin ---");
                          console.log(acr_service_connectObj.id);
                          console.log("Service id end ---");
                          exec("sh git-service-connection.sh", { env: env }, (gitscErr, gitScOut, gtscErr) => {
                              console.log(gitScOut);
                              var gitscObject = JSON.parse(gitScOut);
                              env.github_service_connection_id = gitscObject.id;
                              if (gitscErr !== null) {
                                  console.log(`exec error: ${gtscErr}`);
                              }
                              console.log(gitscErr);
                              setTimeout(function() {
                                  exec("sh acr-service-listing.sh", { env: env }, (std_acr_list_err, std_acr_list_out, std_acr_list_errObj) => {
                                      console.log(std_acr_list_err);
                                      console.log(std_acr_list_out);
                                      console.log("Service id inside listing ---");
                                      console.log(env.acr_service_id);
                                      console.log("Service id listing ---");
                                      exec("sh update-acr-allow-all.sh", { env: env }, (std_uacr_err, std_uacr_out, std_uacr_errObj) => {
                                          console.log(std_uacr_err)
                                          exec("sh create-build-variables.sh", { env: env }, (std_bv_err, std_bv_out, std_bgg_errobject) => {
                                              console.log(std_bv_err);
                                                sendMessage('5');
                                              exec("sh build-pipeline.sh", { env: env }, (std_bperr, std_bp_out, std_bperr_obj) => {
                                                  console.log(std_bperr);
                                                  console.log('6');
                                                  console.log(std_bp_out);
                                                    sendMessage('6');
                                                    var refreshId = setInterval(function() {
                                                    console.log('inside interval');
                                                       exec("sh check-pipeline.sh",{env:env},(std_checkpipe_err,std_checkpipe_out,std_checkpipe_eer_out) =>{
                                                        console.log(std_checkpipe_err);
                                                        var checkPipeOut = JSON.parse(std_checkpipe_out);
                                                          if(checkPipeOut.status === "completed"){
                                                              clearInterval(refreshId);
                                                          }
                                                       })

                                                    }, 1000);
                                              })
                                          })
                                      })
                                  })
                              }, 30000)

                          })
                      })
                  })
              })
          })
      })
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
          console.log(`exec error: ${error}`);
      }
  });

}
wsServer.on('request',function(request){

var userID = getUniqueID();
const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
          const dataFromClient = JSON.parse(message.utf8Data);
          const json = { type: dataFromClient.type };
          users[userID] = dataFromClient;

          startProcess(dataFromClient.data);
        }
      });
})







