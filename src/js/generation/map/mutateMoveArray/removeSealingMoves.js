import { getLegalMoves } from 'js/generation/map/genericGenMapFunctions';
import { checkIfPossibleToReachTargetIterative } from 'js/generation/map/checkIfPossibleToReachTargetIterative';

export const removeSealingMoves = (legalMoves, genMap) => {
	if (!checkIfMapCovered(genMap, 0.5)) {
		legalMoves = legalMoves.filter((move) => !checkIfMoveSeals(move, genMap));
	}
	return legalMoves;
};

const checkIfMapCovered = (genMap, modifier) => {
	const { mapWidth, mapHeight } = genMap.parameters;
	const mapCoverage = modifier * mapWidth * mapHeight;
	return genMap.tiles.length >= mapCoverage;
};

const checkIfMoveSeals = (move, genMap) => {
	const newGenMapObj = { ...genMap, tiles: [ ...genMap.tiles, move ] };
	const nextLegalMoves = getLegalMoves(move, genMap);
	for (let i = 0; i < nextLegalMoves.length; i++) {
		if (!checkIfPossibleToReachTargetIterative(nextLegalMoves[i], newGenMapObj)) return true;
	}
	return false;
};
