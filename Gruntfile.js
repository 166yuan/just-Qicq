/**
 * Created by Administrator on 2015/6/9.
 */
module.exports = function (grunt){
    grunt.initConfig({
        uglify: {
        build: {
            src: 'public/js/qicq.js',//压缩源文件是之前合并的buildt.js文件
                dest: 'public/js/qicq.min.js'//压缩文件为built.min.js
        }
    },
    cssmin: { //css文件压缩
        css: {
            src: 'public/css/qicq.css',//将之前的all.css
                dest: 'public/css/qicq.min.css'  //压缩
        }
    }
});
    // 告诉grunt我们将使用插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-css');
    // 告诉grunt当我们在终端中输入grunt时需要做些什么
    grunt.registerTask('default', ['uglify','cssmin']);

};