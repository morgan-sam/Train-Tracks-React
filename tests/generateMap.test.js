import { generateNewMap } from '../src/js/generation/generateMap';

test('Runs generateNewMap function with howToPage map parameters', () => {
	generateNewMap({ size: 6, seed: 986707260499975, pathFinding: false });
});
