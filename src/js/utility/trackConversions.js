export const convertDirectionArrayToRailTypes = (dirArr) => {
	let previousTileRailType, currentHoverTileRailType;

	if (dirArr.length === 1) {
		if (dirArr[0] % 2 === 0) previousTileRailType = 'vertical';
		if (dirArr[0] % 2 === 1) previousTileRailType = 'horizontal';

		currentHoverTileRailType = previousTileRailType;
	}
	if (dirArr.length === 2) {
		if (dirArr[0] % 2 === 0 && dirArr[1] % 2 === 0) previousTileRailType = 'vertical';
		if (dirArr[0] % 2 === 1 && dirArr[1] % 2 === 1) previousTileRailType = 'horizontal';

		if ((dirArr[0] === 0 && dirArr[1] === 1) || (dirArr[0] === 3 && dirArr[1] === 2))
			previousTileRailType = 'bottomRightCorner';
		if ((dirArr[0] === 1 && dirArr[1] === 2) || (dirArr[0] === 0 && dirArr[1] === 3))
			previousTileRailType = 'bottomLeftCorner';
		if ((dirArr[0] === 2 && dirArr[1] === 3) || (dirArr[0] === 1 && dirArr[1] === 0))
			previousTileRailType = 'topLeftCorner';
		if ((dirArr[0] === 3 && dirArr[1] === 0) || (dirArr[0] === 2 && dirArr[1] === 1))
			previousTileRailType = 'topRightCorner';

		currentHoverTileRailType = dirArr[1] % 2 === 0 ? 'vertical' : 'horizontal';
	}
	return [ previousTileRailType, currentHoverTileRailType ];
};
