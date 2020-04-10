import { generateNewMap } from '../js/generation/generateMap';

const size = 8;
const seed = 986707260499975;

const functionAverageSpeedTest = (message, iterations, fn) => {
	const loggedTimes = [];
	for (let i = 0; i < iterations; i++) {
		const start = performance.now();
		fn();
		const time = performance.now() - start;
		loggedTimes.push(time);
	}
	const average = loggedTimes.reduce((a, b) => a + b) / loggedTimes.length;
	console.log(`${message}: \t ${average} ms`);
};

test('Runs generateNewMap function WITHOUT pathFinding', () => {
	generateNewMap({ size, seed, pathFinding: false });
});

test('Runs generateNewMap function WITH pathFinding', () => {
	generateNewMap({ size, seed, pathFinding: true });
});
