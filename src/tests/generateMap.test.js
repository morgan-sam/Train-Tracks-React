import { generateNewMap } from '../js/generation/generateMap';

const size = 16;
const seed = 986707260499975;

test('Runs generateNewMap function', () => {
	generateNewMap({ size, seed });
});
