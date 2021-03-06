module.exports = function (grunt) {
    var camelCase = require('camelcase');
    require('load-grunt-tasks')(grunt);
    /*
     Loads all Grunt task plugins. You must load a task to use it here.
     Normally, you would have to write something like:
     grunt.loadNpmTask('jshint');
     grunt.loadNpmTask('karma');
     grunt.loadNpmTask('ngTemplates');
     ...for each new tasks you installed and want to use in this Gruntfile.

     But "npm install -g load-grunt-tasks" allows you to write this single line
     to load all available tasks automatically.
     */


    /*
     Here goes the configuration for each task.
     General format goes like this:

     In comparison to maven:
     is like maven plugin name
     is like maven plugin's goal

     If is 'main', this is your default target which runs
     when no target parameter is given in the .registerTask() (see below)

     All file paths in this configuration are relative to the location of Gruntfile.js
     Most file paths may be specified with a glob pattern to load multiple files
     */
    grunt.initConfig({

        jshint: {
            main: {
                files: {
                    /*
                     List files you want jshint to check.
                     You want to list here your configurations, source, and test
                     js files, but do not include your library files.
                     */
                    src: [
                        '*.js',
                        'src/**/*.js',
                        'test/**/*.js'
                    ]
                }
            }
        },

        karma: { // karma test task
            main: { // default target
                /*
                 There are MANY configurations available for karma. We're only scratching the surface here.
                 See the full documentation here
                 https://github.com/karma-runner/grunt-karma
                 http://karma-runner.github.io/0.8/config/configuration-file.html
                 */
                options: {
// we are using jasmine for our testing, you can add others in this array
                    frameworks: ['jasmine'],
// we are only going to use PhantomJS as our test browser,
// you can add more here
                    browsers: ['PhantomJS'],
                    /*
                     Specify the files you want to load for your tests.
                     You should include libraries and sources in the order that a browser should normally load them.
                     You should include the test files.
                     */
                    files: [
                        'bower_components/angular/angular.js',
                        'bower_components/angular-mocks/angular-mocks.js',
                        'src/**/*Module.js',
                        'src/**/*!(Module).js',
                        'test/**/*!(Spec).js',
                        'test/**/*Spec.js'
                    ],
                    /*
                     how to display the results
                     mocha for console output,
                     junit for junit style xml output
                     coverage for code coverage results
                     */
                    reporters: ['mocha'],
// preprocessors are plugins to process files before running tests
// this case, we are preprocessing source files with 'coverage'
// this will instrument our source code
//                    preprocessors: {
//                        'src/**/*.js': ['coverage']
//                    },
// this will run karma and stop it once the test are done
                    singleRun: true,
// specify options for junit reporting
                    junitReporter: {
// junit results will be in this file
                        outputFile: 'test-results.xml'
                    },
// options for code coverage report
                    coverageReporter: {
                        /*
                         You can add multiple reporters and options for each
                         See full list and options
                         http://karma-runner.github.io/0.8/config/coverage.html
                         https://github.com/karma-runner/karma-coverage
                         */
                        reporters: [
                            {type: 'html'}, // html output
                            {type: 'cobertura'} // and a cobertura output
// cobertura is a code coverage report that is consumable by jenkins
                        ]
                    }
                }
            }
        },

        sass: { // less task
            main: { // default target
                files: {
                    'temp/app.min.css': ['src/**/*.scss']
                }
            }
        },

        cssmin: { // css minifier
            main: { // default target
                files: {
// take css in temp, minify it, and save it into dist
                    'dist/app.min.css': ['temp/app.min.css']
                }
            }
        },


// all one module task...
//        ngtemplates: { // angular templates compiler
//            main: { // default task
//                options: {
//                    module: 'myangular', // name of your angular app module
//                    htmlmin: { // minify the html contents
//// see https://github.com/kangax/html-minifier#options-quick-reference for more options
//                        removeComments: true,
//                        collapseWhitespace: true,
//                        collapseBooleanAttributes: true,
//                        removeAttributeQuotes: true,
//                        removeRedundantAttributes: true
//                    }
//                },
//// take all template .html files in source
//                src: ['src/templates/*.html'],
//// save compiled templates in temp
//                dest: 'temp/templates.js'
//            }
//        },

        ngAnnotate: { // angular annotation and concatenator
            main: { // default target
                files: {
                    /*
                     Prepare angular files so they can be minified, and
                     concatenate all the js files into a single file.
                     Save the concatenated file into temp.

                     You should include your libraries used in production,
                     You should include your source js files
                     You should NOT include your test files
                     You should NOT include your dev only libraries
                     */
                    'temp/app.min.js': [
                        'bower_components/angular/angular.js',
                        //'bower_components/angular-route/angular-route.js',
                        'src/**/*Module.js',
                        'src/**/*!(Module).js',
                        'temp/modules/**/*.templates.min.js' // this is the compiled templates.js
                    ]
                }
            }
        },

        uglify: { // minifies your js files
            main: { // default task
// again, many other options available
                options: {
                    sourceMap: true, // we will generate a source map for uglified js
                    sourceMapName: 'dist/app.min.map' // into this dir
                },
                files: {
// files to uglify and destination
// we only have one file to uglify
                    'dist/app.min.js': ['temp/app.min.js', 'temp/modules/**/*.templates.min.js']
                }
            }
        },

        copy: {
            main: {
                files: [
                    // includes files within path
                    {expand: true, cwd: 'src', src: ['index.html'], dest: 'dist/', filter: 'isFile'},
                ]
            }
        },

        clean: ['dist/']
    });

    /*
     Here we can register a task to sub-tasks to run.

     vList of sub-tasks
     grunt.registerTask('test', ['jshint', 'karma']);
     ^Name of your task
     Sub-tasks can be specified to run with a target, such as:
     karma:test_module_1
     where 'karma' is your task
     and 'test_module_1' is your target
     */

    grunt.registerTask('prepModuleTemplates', '...', function () {

        // loop through our modules directory and create subtasks
        // for each module, modifying tasks that affect modules.
        grunt.file.expand("src/*").forEach(function (path) {
            if (!grunt.file.isDir(path)) {
                return;
            }
            // get the module name by looking at the directory we're in (camelCase it)
            var moduleName = camelCase(path.substr(path.lastIndexOf('/') + 1));

            console.error("module", moduleName);
            // add ngtemplate subtasks for each module, turning
            // all module partials into $templateCache objects
            var ngtemplates = {};
            ngtemplates[moduleName] = {
                module: moduleName,
                src: path + "/**/*.html",
                dest: 'temp/modules/' + moduleName + '/' + moduleName + '.templates.min.js'
            };
            grunt.config.set('ngtemplates', ngtemplates);
        });

    });
    /*
     Plan for testing:
     1. Check for syntax and formatting errors in all files
     2. Run karma tests
     */
    grunt.registerTask('test', ['jshint', 'prepModuleTemplates', 'karma']);

    /*
     Plan for building:
     1. Check for syntax and formatting errors in all files
     CSS processing:
     2. Compile sass (.scss) into a .css file
     3. Minify the .css file
     JS processing:
     4. Compile all .html angular template files into a single .js file
     5. Prepare .js files for minification and concatenate all .js files into a single file
     6. Obfuscate the concatenated .js file
     */
    grunt.registerTask('build', ['jshint', 'sass', 'cssmin', 'prepModuleTemplates', 'ngtemplates', 'ngAnnotate', 'uglify']);

};