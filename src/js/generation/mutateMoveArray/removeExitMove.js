import { compareArrays } from '../../utility/utilityFunctions';

export const removeExitMove = (legalMoves, genMap) => {
	legalMoves = legalMoves.filter((move) => !compareArrays(move, genMap.end));
	return legalMoves;
};
