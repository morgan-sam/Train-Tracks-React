import { generateNewMap } from '../js/generation/generateMap';

const size = 16;
const seed = 986707260499975;

test('Runs generateNewMap function WITHOUT iterative', () => {
	generateNewMap({ size, seed, pathFinding: false, iterative: false });
});

test('Runs generateNewMap function WITH iterative', () => {
	generateNewMap({ size, seed, pathFinding: true, iterative: true });
});
