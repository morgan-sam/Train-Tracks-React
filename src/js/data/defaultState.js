import { getRandomSeed } from 'js/utility/utilityFunctions';

export const defaultGameState = {
	size: 8,
	seed: getRandomSeed(),
	difficulty: 3,
	mapObject: null,
	active: false,
	visualEffects: true
};
