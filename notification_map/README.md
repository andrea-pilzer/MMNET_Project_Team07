#NOTIFICATIONS' VISUALIZATION MAP

<!--- This README is written using Markdown syntax. To correctly visualize it use a suitable editor (for ex. http://dillinger.io/) --->

This web application (realized using AngularJS) connects to a server at dev.smartcommunitylab.it, downloads all records and visualizes them on a Google map.

## Using the application

To run this web application you need to firstly run the node.js server included in this pachage; from the src folder run:

```bash
$ node server.js
```
Warning: you must have a runnning version of `node.js` on your computer

Then you can run the web application as localhost running in src folder:
```bash
http://localhost:8070/index.html
```
Warning: Please avoid opening directly the index.html page in your preferred browser: without the node.js server the web application wouldn't be able to both connect to the server and correctly launch the Google Map service.