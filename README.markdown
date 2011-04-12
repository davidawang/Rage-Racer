RageRacer
===
v 0.1.0
***Note:***
This version of rage racer was demoed at Spring 2011 HackNY. It's very "hacked" and makes a lot of unnecessary broadcast calls. Future versions will fix this and use modules dnode + connect.

To see our demo video at HackNY, jump to minute 1:17:27 of the [archive of the livestream:](http://bit.ly/rageracer)

Getting Started
===
Install node.js, npm, socket.io (eyes for debuggin purposes)

Clone the git repo, install dependencies, and start our demo:
  
1. cd rageracer/
2. npm install eyes socket.io
3. node rageracer.js

To view the GUI, open the serverrunner.html under the folder "client". During the demo we hosted serverrunner.html 
and server.js on another server, but it can hosted on the same server (given that node.js is properly configured to serve them as static files).
This will be fixed in future releases.

Many thanks to the guys at [Nodejitsu](http://www.nodejitsu.com) for their help.




