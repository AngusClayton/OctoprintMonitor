const { app, BrowserWindow } = require("electron");
const { ipcMain } = require('electron');
const { Notification } = require('electron')
const fs = require('fs');
const path = require('path');
//user config stuff
ipcMain.on('userConfig', (event, arg) => {
    //read user config file.
    var configPath = path.join(app.getPath("userData"), "config.json");
    console.log(configPath);
    var setupCorrect = false;
    if (fs.existsSync(configPath)) {
       fs.readFile(configPath, 'utf8', (err, data) => {
           //convert data to json
           data = JSON.parse(data);
           data["status"] = 200;
           console.log(data['HOSTNAME']);
           if ((data['HOSTNAME'] == null) || (data['API-KEY'] == null)) {
               setupCorrect = false;
               
           }
           else {setupCorrect = true;}

           if (!setupCorrect) 
           {
                console.log("Setup incomplete");
                event.reply('userConfig-reply', {"body":'<span style="user-select: none"> Please set API key and password in this file: </span><span class="Highlight3">' + configPath + "</span>", "status":404});
           }
           else //setup correct:
           {
               console.log("Setup complete");
               event.reply('userConfig-reply', data);
           }
            
        
        
        })
        
    }
    else {
        
        fs.writeFile(configPath, '{"API-KEY":null,"HOSTNAME":null}', err => {if(err){console.log(err)}});
        

    }
    
  })

// notify when print almost done:
ipcMain.on('notification', (event, arg) => {

    console.log(arg);
    const notification = {
        title: 'OctoPrint',
        body: arg
      }
      new Notification(notification).show()

});



  

function createWindow() {    // Create the browser window.    
    let win = new BrowserWindow({       
         width: 800,        
         height: 600,        
         webPreferences: {            
             nodeIntegration: true       
        }    
    });   
// and load the index.html of the app.  

win.loadFile("index.html");}
app.on("ready", createWindow);
