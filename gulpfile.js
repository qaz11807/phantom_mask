const gulp = require('gulp');
const babel = require('gulp-babel'); // 載入 gulp-babel 套件
const del = require('del');

gulp.task(
  'json',
  () => {
    return gulp.src(['./tmp/**/*.json']) 
      .pipe(gulp.dest('./dist/'));
  }
);

gulp.task(
  'babel',
  () => {
    return gulp.src(['./tmp/**/*.js']) 
      .pipe(
        babel({
          presets: ['@babel/env'], 
          plugins: ["@babel/plugin-transform-runtime"]
        })
      )
      .pipe(gulp.dest('./dist/'));
  }
);

gulp.task(
  'clean', 
  () => {
    return del([
      './dist/**/*'
    ]);
  }
);

gulp.task(
  'clean:tmp', 
  () => {
    return del([
      './tmp/'
    ]);
  }
);

gulp.task('build', gulp.series('babel', 'json', 'clean:tmp'));