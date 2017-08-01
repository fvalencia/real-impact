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

* Developed and Tested on Google Chrome v59, Mac OS Sierra, in 18h.
* For the Correlation between Distance and Delays, I implemented a Polynomial Regression base on the Flights data.
* After the user inputs the from and to field and search for the data, you can see a Toast from Angular material showing the predicted flight delay.
* I wanted to show every graph and information to the user in a usable way, that's why I created those radio buttons instead of creating a whole dashboard view.
* You can see the live version [here][2]

### Implementation
Here are some of the libraries and plugins used for this:

* [Angular Material Design][3]
* [Correlation Prototype Class][4]
* [Gulp][5]
* [Angular NVD3 (For graphs)][6]

### How to run it.  

```
$ git clone https://github.com/fvalencia/real-impact.git
$ cd real-impact
$ npm install && bower install
```

**Test**
```
$ gulp test
```
Note: I created a spec for HomeController to show how to make tests with Jasmine, but didn't went through every function or directive, for time reasons.

**Development**
```
$ gulp serve
```

**Production (Builded Version)**
```
$ gulp build
```
Note: I create a new repo for the builded version and that's the one I show in GitHub Pages

[1]: https://github.com/Swiip/generator-gulp-angular
[2]: https://fvalencia.github.io/real-impact-build/#!/
[3]: https://material.angularjs.org/latest/
[4]: https://codepen.io/RobertMenke/pen/ONvVXq
[5]: https://gulpjs.com/
[6]: http://nvd3.org/
