module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.initConfig({
    coffee: {
      compile: {
        src: ['*.coffee', 'lib/**/*.coffee', 'test/**/*.coffee']
      }
    },
    coffeelint: {
      lib: ['*.coffee', 'lib/**/*.coffee'],
      test: {
        files: {
          src: ['test/**/*.coffee']
        },
        options: {
          "max_line_length": 120
        }
      }
    },
    mochaTest: {
      tests: ['test/**/*.js']
    }
  });
  grunt.registerTask('default', 'coffee coffeelint mochaTest');
};