module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.initConfig({
    lint: {
      files: ['*.js', 'lib/**/*.js']
    },
    mochaTest: {
      tests: ['test/**/*.js']
    }
  });
  grunt.registerTask('default', 'lint mochaTest');
};
