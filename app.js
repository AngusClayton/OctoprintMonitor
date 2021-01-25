/* Octoprint Monitor V1
24/1/2021
Angus clayton

load window runs gets data from api, and passes this to processX() functions, which turn the json into DOM.innerHTML attrubutes
------ TO DO: -------------------------------

 - test the notification logic (once notified, should wait till printer no-longer printing before allowing notification again.)
 ^ Appears to be working (atleast the 1st part, not sure if will allow notificaiton again, requires more testing.)
*/
const { ipcRenderer } = require('electron')

// Load config File:
var hostname = "";
var apikey = "";
var notified = false;
//get and render.


function proccesStatus(j) {
    document.getElementById("status").innerHTML = j["state"]["text"];
    if (j["state"]["text"] != "Printing") {notified = false;}
    document.getElementById("bed").innerHTML = j["temperature"]["bed"]["actual"];
    document.getElementById("hotend").innerHTML = j["temperature"]["tool0"]["actual"];
}

function proccesJob(j){
    document.getElementById("timeRemaining").innerHTML = Math.round(j["progress"]["printTimeLeft"]/60);
    document.getElementById("totalTime").innerHTML = Math.round(j["progress"]["printTime"]/60);
    document.getElementById("completion").innerHTML = Math.round(j["progress"]["completion"]);
    if (document.getElementById("status").innerHTML == "Printing") 
    {
        document.getElementById("fileName").innerHTML = ": " + j["job"]["file"]['display'];
    }
    else
    {
      document.getElementById("fileName").innerHTML = "";
    }

    //check time remaining, if less than 1.5 minute; notify the user.
    if (j["progress"]["printTimeLeft"]/60 < 1.5)
    {
      //notify the user.
      if (!notified) {
        ipcRenderer.send("notification","Your Print is Nearly Complete! " + document.getElementById("timeRemaining").innerHTML + "min left.");
        notified = true;
      }
    }
    
}

function updateText() {
      console.log("Updated Screen")

      //Printer Status and temps:
      var urlStatus = hostname + "/api/printer";
      fetch(urlStatus,{headers: {'X-Api-Key': apikey}}).then(r=>r.json().then(j=> proccesStatus(j)));
      
  
      // Job status
      var jobStatus = hostname + "/api/job";
      fetch(jobStatus,{headers: {'X-Api-Key': apikey}}).then(r=> r.json().then(j=> proccesJob(j)));

      //recursion, repeat in 5 sec.
      setTimeout(updateText, 5000);
      
}

window.onload = function() {

  //listen for config data
  ipcRenderer.on('userConfig-reply', (event, arg) => {
    if (arg["status"]==404) 
    {
      document.getElementById("warningBox").innerHTML = arg['body']; 
    }
    else
    {
      apikey = arg['API-KEY'];
      hostname = arg['HOSTNAME'];
      //document.getElementById("warningBox").innerHTML = JSON.stringify(arg);  //dump data into warning Box for debug
      updateText();
    }
  })
  ipcRenderer.send('userConfig', 'ping')
  
  
  
  
    
    
}