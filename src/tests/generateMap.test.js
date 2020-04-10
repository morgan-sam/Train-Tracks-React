import { generateNewMap } from '../js/generation/generateMap';

const size = 10;
const seed = 986707260499975;

test('Runs generateNewMap function WITHOUT pathFinding', () => {
	generateNewMap({ size, seed, pathFinding: false });
});

test('Runs generateNewMap function WITH pathFinding', () => {
	generateNewMap({ size, seed, pathFinding: true });
});
