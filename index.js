'use strict';

var ExecBuffer = require('exec-buffer');
var isJpg = require('is-jpg');
var jpegRecompress = require('jpeg-recompress-bin').path;

/**
 * jpegrecompress image-min plugin
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
	opts = opts || {};
	opts.strip = opts.strip || true;

	return function (file, imagemin, cb) {
		if (!isJpg(file.contents)) {
			cb();
			return;
		}

		var exec = new ExecBuffer();
		var args = [exec.src(), exec.dest()];

		if (opts.strip) {
			args.push('-s');
		}

		if (opts.accurate) {
		args.push('-a');
		}

		if (opts.quality) {
			args.push('-q', opts.quality);
		}

		if (opts.method) {
			args.push('-m', opts.method);
		}

		if (opts.target) {
			args.push('-t', opts.target);
		}

		if (opts.min) {
			args.push('-n', opts.min);
		}

		if (opts.max) {
			args.push('-x', opts.max);
		}

		if (opts.loops) {
			args.push('-l', opts.loops);
		}

		if (opts.defish) {
			args.push('-d', opts.defish);
		}

		if (opts.zoom) {
			args.push('-z', opts.zoom);
		}

		exec
			.use(jpegRecompress, args)
			.run(file.contents, function (err, buf) {
				if (err) {
					cb(err);
					return;
				}

				file.contents = buf;
				cb();
			});
	};
};
