var files = ['*.js', 'lib/**/*.js', 'test/**/*.js'];

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    jshint: {
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
  grunt.registerTask('default', ['jshint', 'mochaTest:tests']);
  grunt.registerTask('at', ['default', 'mochaTest:acceptanceTests']);
};
