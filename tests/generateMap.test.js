import { generateNewMap } from '../src/js/generation/generateMap';

const size = 10;
const seed = 986707260499975;

test('Runs generateNewMap function WITHOUT pathFinding', () => {
	const start = performance.now();
	generateNewMap({ size, seed, pathFinding: false });
	console.log(`Without pathfinding took:\t${performance.now() - start} ms`);
});

test('Runs generateNewMap function WITH pathFinding', () => {
	const start = performance.now();
	generateNewMap({ size, seed, pathFinding: true });
	console.log(`With pathfinding took:\t${performance.now() - start} ms`);
});
