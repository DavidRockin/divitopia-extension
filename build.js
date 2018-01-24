const gulp  = require('gulp');
const babel = require('gulp-babel');
const zip   = require('gulp-zip');
const dirs  = require('gulp-folders');

const files = ['manifest.json', 'src/**', 'resources/**'];
const name  = 'divitopia-' + (require('./package.json').version);

console.log('[!] Building');

gulp.src(files, { base : './'})
	.pipe(zip(name + '.xpi'))
	.pipe(gulp.dest('./dist/'))
;
