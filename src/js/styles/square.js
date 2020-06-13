export const getSquareStyle = (BOX_DIM_REM) => {
	return {
		minHeight: `${BOX_DIM_REM}rem`,
		minWidth: `${BOX_DIM_REM}rem`,
		display: 'flex',
		position: 'relative',
		top: '0',
		left: '0',
		height: `${BOX_DIM_REM}rem`,
		width: `${BOX_DIM_REM}rem`
	};
};
