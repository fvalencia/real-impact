# Real Impact Analytics

### Folder Structure

* gulp: this folder contains all the gulp tasks for the project, I want to said here that I didn't write those lines and they are from a public [YeoMan Generator][1], I do know how to modify it but I didn't want to reinvent the wheel.

* src:  this is the source folder and contains the project base code, this one written by me.
  * app: This contains the main application files
    * common: Contains the components that live across the app such as layouts, directives, factories, etc.
    * states: States of the application, home, detail, etc.
    * app.config: Configuration of libraries and Angular related plugins.
    * app.constants: Constants of the application.
    * app.module: Module dependencies configuration.
    * app.run: Run function, useful to intercept states changes and Auth services.
    * app.scss: Main Stylesheet of the application, used by gulp to compile the scss.
  * assets: Public assets folder, images, fonts, icons, etc.
  * index.html: app html markup, this file shouldn't be edited and it is used by gulp to inject the javascript and scss compiled files

### Notes

* Developed and Tested on Google Chrome v59, Mac OS Sierra.

### How to run it.  

```
$ git clone https://github.com/fvalencia/real-impact.git
$ cd real-impact
$ npm install && bower install
```

**Development**
```
$ gulp serve
```

**Production (Builded Version, just one .css and .js)**
```
$ npm install http-server -g
$ gulp build
$ http-server ./dist
```
Note: You can run it in any server, but it is easier with `http-server`

[1]: https://github.com/Swiip/generator-gulp-angular
