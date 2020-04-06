export const getAxisStyle = (BOX_DIM_REM, axisType) => {
	const defaultStyle = {
		opacity: '0',
		position: 'absolute',
		height: `${BOX_DIM_REM / 2 * 0.707106781}rem`,
		width: `${BOX_DIM_REM / 2 * 0.707106781}rem`,
		zIndex: '1',
		webkitTransform: 'rotate(45deg) translate(-50%, -50%)',
		mozTransform: 'rotate(45deg) translate(-50%, -50%)',
		oTransform: 'rotate(45deg) translate(-50%, -50%)',
		msTransform: 'rotate(45deg) translate(-50%, -50%)',
		transform: 'rotate(45deg) translate(-50%, -50%)',
		transformOrigin: 'top left'
	};
	const selectedAxisStyle = axisStyles()[axisType];
	return { ...defaultStyle, ...selectedAxisStyle };
};

const axisStyles = () => {
	return {
		top: {
			top: '25%',
			left: '50%'
		},

		left: {
			top: '50%',
			left: '25%'
		},

		bottom: {
			top: '75%',
			left: '50%'
		},

		right: {
			top: '50%',
			left: '75%'
		}
	};
};
