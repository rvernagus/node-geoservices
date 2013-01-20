module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-jslint');
  grunt.initConfig({
    lint: {
      files: ['*.js', 'lib/**/*.js', 'test/**/*.js']
    }
  });
  grunt.registerTask('default', 'lint');
};