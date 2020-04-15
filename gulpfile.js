const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpIf = require('gulp-if');
const postcss = require('gulp-postcss');
const postcssPresetEnv = require('postcss-preset-env');
const importOnce = require('node-sass-import-once');
const image = require('gulp-image');
const del = require('del');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

gulp.task('clean', function() {
	return del(['dist/**/*']);
});

gulp.task('sass', function() {
	return gulp
		.src('assets/sass/**/*.scss')
		.pipe(
			sass({
				importer: importOnce,
				outputStyle: 'compressed',
			})
		)
		.pipe(
			gulpIf(
				!isDevelopment,
				postcss([
					postcssPresetEnv({
						browsers: ['last 2 versions', 'Firefox ESR', 'not ie < 9'],
					}),
				])
			)
		)
		.pipe(gulp.dest('dist/css'));
});

gulp.task('js', function() {
	return gulp
		.src('assets/js/*.js')
		.pipe(gulp.dest('dist/js'));
});

gulp.task('fonts', function() {
	return gulp.src('./assets/fonts/**/*.*').pipe(gulp.dest('dist/fonts'));
});

gulp.task('images', function() {
	return gulp
		.src('assets/images/**/*.*')
		.pipe(image())
		.pipe(gulp.dest('dist/images'));
});

gulp.task('pug', function() {
	return gulp
	.src('assets/pug/**/**.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	gulp.watch('assets/**/*.scss', gulp.series('sass'));
	gulp.watch('assets/images/**/*.*', gulp.series('images'));
	gulp.watch('assets/**/*.js', gulp.series('js'));
	gulp.watch('assets/pug/**/**.pug', gulp.series('pug'));
});

gulp.task(
	'build',
	gulp.series(
		'clean',
		gulp.parallel(
			'fonts',
			'js',
			'pug',
			gulp.series(gulp.parallel('images', 'sass'))
		)
	)
);

gulp.task('server', function() {
	browserSync.init({
		server: 'dist',
	});

	browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'server'))
);

gulp.task('default', function() {});