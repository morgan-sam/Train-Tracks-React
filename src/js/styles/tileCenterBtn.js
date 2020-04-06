export const getCenterStyle = (BOX_DIM_REM) => {
	return {
		opacity: '0',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		height: `${BOX_DIM_REM / 5 * 2}rem`,
		width: `${BOX_DIM_REM / 5 * 2}rem`,
		zIndex: '1',
		borderRadius: '5rem'
	};
};
