export const getWaveButtonStyles = (hovered) => {
	return {
		btnDefaultStyle: {
			position: 'relative',
			overflow: 'hidden',
			cursor: 'pointer',
			background: 'none',
			zIndex: '0',
			borderRadius: '1rem',
			border: '1px #ccc solid',
			outline: 'none',
			transition: '0.3s',
			top: '0px',
			boxShadow: '0px 5px 0px 2px #eee'
		},

		btnPressedStyle: {
			transition: '0.1s',
			top: '10px',
			boxShadow: 'none'
		},

		rectangleStyle: {
			top: '0%',
			left: '-30%',
			height: '350%',
			width: '70rem',
			position: 'absolute',
			zIndex: '-1',
			borderRadius: '50rem'
		},

		textStyle: {
			zIndex: '1',
			color: hovered ? 'white' : 'black',
			transition: hovered ? 'color 1s cubic-bezier(0,2.53,.53,-1.51)' : `color 0s`
		},

		whiteBackground: {
			zIndex: '-2',
			top: '0',
			left: '0',
			position: 'absolute',
			height: '100%',
			width: '100%',
			backgroundColor: 'white'
		}
	};
};

export const rectangleParameters = {
	rectangleCount: 5,
	startRotation: 30,
	rotationOffset: 2,
	get endRotation() {
		return -15 + this.rectangleCount * this.rotationOffset;
	},
	startTransition: 1.5,
	endTransition: 3,
	transitionOffset: 0.1,
	cubicBezierFunction: 'cubic-bezier(0,1.84,0,.32)'
};
