module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    jade:
      options:
        pretty: true
      compile:
        files:[
          expand: true
          cwd: 'src/jade/'
          src: '*.jade'
          dest: 'dest/html/'
          ext: '.html']

    coffee:
      compile:
        expand: true
        flatten: false
        cwd: 'src/coffee'
        src: '*.coffee'
        dest: 'dest/js/'
        ext: '.js'
        options:
          bare: true
          join: true

    stylus:
      options:
        compress: false
      compile:
        files:[
          expand: true
          cwd: 'src/stylus/'
          src: '*.styl'
          dest: 'dest/css/'
          ext: '.css']

    shell:
      rsync:
        command: ''#'rsync -av /Users/Morishin/Programming/Portfolio/dest/ --exclude ".DS_Store" -e ssh morishin:/usr/share/nginx/html/morishin.me'

    watch:
      jade:
        files: 'src/jade/*.jade'
        tasks: ['jade']

      coffee:
        files: 'src/coffee/*.coffee'
        tasks: ['coffee']

      stylus:
        files: 'src/stylus/*.styl'
        tasks: ['stylus']

  grunt.loadNpmTasks 'grunt-contrib-jade'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-shell'

  grunt.registerTask 'default', ['watch']
  grunt.registerTask 'all', ['jade','stylus','coffee']
  grunt.registerTask 'deploy', ['shell:rsync']

  return
