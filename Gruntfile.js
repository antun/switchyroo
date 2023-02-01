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
      },
      vite: {
        cmd: 'vite',
        args: [
          'build'
        ]
      }

    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**', '!vue/**'],
            dest: 'dist/switchyroo'
          },
          {
            expand: true,
            cwd: 'src/vue/',
            src: ['index.html', 'styles.css'],
            dest: 'dist/switchyroo/popup'
          }
        ]
      }
    },
    compress: {
      main: {
        options: {
          archive: 'dist/switchyroo.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'dist/switchyroo/',
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
          {src: ['dist/switchyroo/manifest.json'], dest: 'dist/switchyroo/manifest.json'}
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

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-run');


  // Default task.
  grunt.registerTask('default', ['run:vite', 'copy:main', 'replace:version']);
  grunt.registerTask('build', ['default', 'compress']);
  grunt.registerTask('publish', ['bump', 'build']);
  grunt.registerTask('test', ['run:npm_test_jest']);

};
