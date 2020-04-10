import { generateNewMap } from '../src/js/generation/generateMap';

const size = 8;
const seed = 986707260499975;

test('Runs generateNewMap function WITHOUT pathFinding', () => {
	const loggedTimes = [];
	for (let i = 0; i < 10; i++) {
		const start = performance.now();
		generateNewMap({ size, seed, pathFinding: false });
		const time = performance.now() - start;
		loggedTimes.push(time);
	}
	const average = loggedTimes.reduce((a, b) => a + b) / loggedTimes.length;
	console.log(`Average time without pathfinding took: \t ${average} ms`);
});

test('Runs generateNewMap function WITH pathFinding', () => {
	const loggedTimes = [];
	for (let i = 0; i < 10; i++) {
		const start = performance.now();
		generateNewMap({ size, seed, pathFinding: true });
		const time = performance.now() - start;
		loggedTimes.push(time);
	}
	const average = loggedTimes.reduce((a, b) => a + b) / loggedTimes.length;
	console.log(`Average time with pathfinding took: \t ${average} ms`);
});
