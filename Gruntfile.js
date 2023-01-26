/*global module:false*/
module.exports = function(grunt) {

  //require("grunt-contrib-copy")(grunt);
  //require("time-grunt")(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %>-<%= pkg.customer.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("isoDateTime") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    filename: '<%= pkg.name %>-<%= pkg.customer.name %>',
    // Task configuration.
    eslint: {
      options: {
        eslintrc: "./.eslintrc"
      },
      lib_test: {
        src: ['src/**/*.js', '!src/lib/**.js']
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.*', 'tests/**/*.*'],
        tasks: ['default', 'test'],
        options: {
          interrupt: true,
        },
      },
    },
    run: {
      options: {
        // ...
      },
      npm_test_jest: {
        cmd: 'npm',
        args: [
          'run',
          'test'
        ]
      }

    },
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**'],
          dest: 'dist/implementationswitcher'
        }
        ]
      }
    },
    compress: {
      main: {
        options: {
          archive: 'dist/implementationswitcher.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'dist/implementationswitcher/',
            src: ['**'],
            dest: ''
          },
        ]
      }
    },
    replace: {
      version: {
        options: {
          patterns: [
            {
              match: 'version',
              replacement: '<%= bump.version || pkg.version %>'
            }
          ]
        },
        files: [
          {src: ['dist/implementationswitcher/manifest.json'], dest: 'dist/implementationswitcher/manifest.json'}
        ]
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        pushTo: 'origin'
      }
    },
    gitinfo: {}
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-run');


  // Default task.
  grunt.registerTask('default', ['eslint', 'copy:main', 'replace:version']);
  grunt.registerTask('build', ['default', 'compress']);
  grunt.registerTask('publish', ['eslint', 'bump', 'build']);
  grunt.registerTask('test', ['run:npm_test_jest']);

};
