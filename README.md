# OctoprintMonitor
A minimal electron js app for monitoring (not controlling) key aspects of octoprint. Will push notify the user when a print is about to complete.

config file located `%appdata%/octoprintMonitor`


did not include the node modules folder.

------ TO DO: -------------------------------

 - test the notification logic (once notified, should wait till printer no-longer printing before allowing notification again.)
 ^ Appears to be working (atleast the 1st part, not sure if will allow notificaiton again, requires more testing.)
