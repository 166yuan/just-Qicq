/**
 * Created by Administrator on 2015/6/9.
 */
module.exports = function (grunt){
    grunt.initConfig({
        uglify: {
        build: {
            src: 'public/js/qicq.js',//ѹ��Դ�ļ���֮ǰ�ϲ���buildt.js�ļ�
                dest: 'public/js/qicq.min.js'//ѹ���ļ�Ϊbuilt.min.js
        }
    },
    cssmin: { //css�ļ�ѹ��
        css: {
            src: 'public/css/qicq.css',//��֮ǰ��all.css
                dest: 'public/css/qicq.min.css'  //ѹ��
        }
    }
});
    // ����grunt���ǽ�ʹ�ò��
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-css');
    // ����grunt���������ն�������gruntʱ��Ҫ��Щʲô
    grunt.registerTask('default', ['uglify','cssmin']);

};