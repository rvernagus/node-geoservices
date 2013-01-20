module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.initConfig({
    coffeelint: {
      app: ['*.coffee', 'lib/**/*.coffee'],
      tests: {
        files: {
          src: ['test/**/*.coffee']
        },
        options: {
          "max_line_length": 120
        }
      }
    }
  });
  grunt.registerTask('default', 'coffeelint');
};