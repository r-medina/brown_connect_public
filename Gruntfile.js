'use strict';

module.exports = function (grunt) {
    var reloadPort = 35729;
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        develop: {
            server: {
                file: 'index.js'
            }
        },
        connect: {
            options: {
                port: 3000,
                hostname: 'localhost'
            },
            dev: {
                options: {
                    middleware: function (connect) {
                        return [
                            require('connect-livereload')(), // <--- here
                            checkForDownload,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app')
                        ];
                    }
                }
            }
        },
        watch: {
            server: {
                files: [
                    'index.js', 'controllers/*.js', 'locales/*.js',
                    'models/*.js', 'lib/*.js', 'config/*.json'
                ],
                tasks: ['develop'],
                options: {
                    nospawn: true
                }
            },
            sass: {
                files: ['public/scss/*.{scss,sass}'],
                tasks: ['compass']
            },
            css: {
                files: ['public/css/*.css'],
                options: {
                    livereload: reloadPort
                }
            },
            js: {
                files: ['public/js/**/*.js'],
                options: {
                    livereload: reloadPort
                }
            },
            html: {
                files: ['public/templates/**/*.dust', 'public/templates/*.dust',
                    'public/html/*.html'
                ],
                options: {
                    livereload: reloadPort
                }
            }
        },
        compass: {
            dist: {}
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'public/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'public/css/',
                ext: '.min.css'
            }
        },
        jshint: {
            files: ['controllers/**/*.js', 'lib/**/*.js', 'models/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        requirejs: {
            build: {
                options: {
                    baseUrl: 'public/js',
                    //dir: '.build/js',
                    optimize: 'uglify',
                    //modules: [{
                    name: 'app',
                    //}],
                    paths: {
                        lib: './lib',
                        app: './app',
                        directives: './app/directives',
                        controllers: './app/controllers',
                        components: './components'
                    },
                    out: '.build/js/app.min.js'
                }
            }
        },
        makara: {
            files: ['public/templates/**/*.dust'],
            options: {
                contentPath: ['locales/**/*.properties']
            }
        },
        dustjs: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'tmp/',
                    src: '**/*.dust',
                    dest: '.build/templates',
                    ext: '.js'
                }],
                options: {
                    fullname: function (filepath) {
                        var path = require('path'),
                            name = path.basename(filepath, '.dust'),
                            parts = filepath.split(path.sep),
                            fullname = parts.slice(3, -1).concat(name);

                        return fullname.join(path.sep);
                    }
                }
            }
        },
        copyto: {
            build: {
                files: [{
                    cwd: 'public',
                    src: ['**/*'],
                    dest: '.build/'
                }],
                options: {
                    ignore: [
                        'public/js/**/*',
                        'public/templates/**/*',
                        'public/scss/**/*',
                        'public/css/app.css'
                    ]
                }
            }
        },
        clean: {
            'tmp': 'tmp',
            'build': '.build/templates'
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                autoWatch: false,
                singleRun: true
            }
        },
        mochacli: {
            src: ['test/mocha/*.js'],
            options: {
                globals: ['chai'],
                timeout: 6000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            }
        },
        jsbeautifier: {
            default: {
                src: [
                    './*.js', './controllers/*.js', './lib/*.js',
                    './models/*.js', './public/js/**/*.js'
                ],
                options: {
                    js: {
                        indentChar: ' ',
                        indentSize: 4,
                        maxPreserveNewLines: 0,
                        preserveNewlines: true,
                        evalCode: true,
                        jslintHappy: true,
                        wrapLineLength: 90
                    }
                }
            },
            "git-pre-commit": {
                src: [
                    './*.js', './controllers/*.js', './lib/*.js',
                    './models/*.js', './public/js/**/*.js'
                ],
                options: {
                    js: {
                        indentChar: ' ',
                        indentSize: 4,
                        maxPreserveNewLines: 0,
                        preserveNewlines: true,
                        evalCode: true,
                        jslintHappy: true,
                        wrapLineLength: 90
                    },
                    mode: 'VERIFY_ONLY'
                }
            }
        },
        githooks: {
            all: {
                'pre-commit': 'pre-commit',
                'post-commit': 'build'
            }
        }
    });

    grunt.loadTasks('./node_modules/makara/tasks/');

    grunt.registerTask('default', [
        'develop', 'watch'
    ]);
    grunt.registerTask('i18n', [
        'clean', 'makara', 'dustjs', 'clean:tmp'
    ]);
    grunt.registerTask('build', [
        'jshint', 'requirejs', 'cssmin', 'copyto', 'i18n'
    ]);
    grunt.registerTask('test', [
        'jshint', 'karma', 'mochacli'
    ]);
    grunt.registerTask('pre-commit', [
        'jsbeautifier:git-pre-commit' //, 'test'
    ]);

};
