const {execFileSync} = require('child_process');
const jpegRecompress = require('jpeg-recompress-bin');
//requiring path and fs modules
const path = require('path');
const fs = require('fs');
//joining path of directory
const directoryPath = path.join(__dirname, 'images');
// const directoryPath = '/Users/doducnhat/Documents/Pictures/100D3400';
//passsing directoryPath and callback function
fs.readdir(directoryPath, async function (err, files) {
	//handling error
	if (err) {
		return console.log('Unable to scan directory: ' + err);
	}

	let count = 0;
	let totalTime = 0;
	let max = 0;
	let min = 0;

	for (let filename of files) {
		// Do whatever you want to do with the file
		if (/^.*\.(jpe?g|JPE?G)$/.test(filename)) {
			// const file = path.join(__dirname, `images/${filename}`);
			const file = path.join(directoryPath, filename);
			console.log(file);

			let time = await compressImage(file, filename);
			totalTime += time

			if (min < 1) {
				min = time
			} else {
				if (time < min) {
					min = time
				}
			}

			if (max < 1) {
				max = time
			} else {
				if (time > max) {
					max = time
				}
			}

			count++;
		}
	}

	console.log(`Compressed ${count} images in ${totalTime}. AVG: ${totalTime / count}. MIN: ${min}. MAX: ${max}`);
});

async function compressImage(file, filename) {
	const start = new Date();
	execFileSync(jpegRecompress, ['--quality', 'high', '--min', 60, '--quiet', '--strip', file, path.join(__dirname, `results/binary/${filename}`)]);
	const end = new Date() - start;

	console.log(`Images optimized: ${filename} - Time: ${end}`);
	return end;
}
