export const getCornerStyle = (BOX_DIM_REM, cornerType) => {
	const defaultStyle = {
		zIndex: '1',
		opacity: '0',
		height: '0',
		width: '0',
		borderStyle: 'solid',
		position: 'absolute'
	};
	const selectedCornerStyle = cornerStyles(BOX_DIM_REM)[cornerType];
	return { ...defaultStyle, ...selectedCornerStyle };
};

const cornerStyles = (BOX_DIM_REM) => {
	return {
		'top-left': {
			top: '0',
			left: '0',
			borderWidth: `0 0 ${BOX_DIM_REM / 2}rem ${BOX_DIM_REM / 2}rem`
		},
		'top-right': {
			top: '0',
			left: `${BOX_DIM_REM / 2}rem`,
			borderWidth: `0 ${BOX_DIM_REM / 2}rem ${BOX_DIM_REM / 2}rem 0`
		},

		'bottom-left': {
			top: `${BOX_DIM_REM / 2}rem`,
			left: '0',
			borderWidth: `${BOX_DIM_REM / 2}rem 0 0 ${BOX_DIM_REM / 2}rem`
		},

		'bottom-right': {
			top: `${BOX_DIM_REM / 2}rem`,
			left: `${BOX_DIM_REM / 2}rem`,
			borderWidth: `${BOX_DIM_REM / 2}rem ${BOX_DIM_REM / 2}rem 0 0`
		}
	};
};
