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
      acceptanceTests: {
        options: {
          timeout: 10000
        }
      }
    }
  });
  grunt.registerTask('default', 'lint mochaTest:tests');
  grunt.registerTask('at', 'default mochaTest:acceptanceTests');
};
