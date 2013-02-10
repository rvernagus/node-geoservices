var files = ['*.js', 'lib/**/*.js', 'test/**/*.js'];

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.initConfig({
    lint: {
      files: files
    },
    mochaTest: {
      tests: ['test/**/*.js'],
      acceptanceTests: ['acceptanceTest/**/*.js']
    },
    mochaTestConfig: {
      tests: {

      },
      acceptanceTests: {

      }
    }
  });
  grunt.registerTask('default', 'lint mochaTest:tests');
  grunt.registerTask('at', 'lint mochaTest:tests mochaTest:acceptanceTests');
};
