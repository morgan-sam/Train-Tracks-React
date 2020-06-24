export const getSquareStyle = (BOX_DIM_REM, classname) => {
	return {
		minHeight: `${BOX_DIM_REM}rem`,
		minWidth: `${BOX_DIM_REM}rem`,
		display: 'flex',
		position: 'relative',
		top: '0',
		left: '0',
		height: `${BOX_DIM_REM}rem`,
		width: `${BOX_DIM_REM}rem`,
		...getSquareCursor(classname)
	};
};

const getSquareCursor = (classname) => {
	if (classname === 'mapTile') return { cursor: 'cell' };
	else if (classname === 'defaultTrack') return { cursor: 'auto' };
};
