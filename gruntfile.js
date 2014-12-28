module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            build: {
                src: "EventEmitter.js",
                dest: "EventEmitter.min.js"
            }
        },
        run: {
            test: {
                exec: "jasmine JASMINE_CONFIG_PATH=test/jasmine.json"
            }
        },
        watch: {
            main: {
                files: "EventEmitter.js",
                tasks: ["test", "min"]
            }
        }
    });
    
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-run");
    grunt.loadNpmTasks("grunt-contrib-watch");
    
    grunt.registerTask("min", ["uglify"]);
    grunt.registerTask("test", ["run:test"]);
    grunt.registerTask("default", ["test", "min"]);
}