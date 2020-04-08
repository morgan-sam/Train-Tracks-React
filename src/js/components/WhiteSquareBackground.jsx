import React from 'react';

export const WhiteSquareBackground = (props) => {
	return (
		<div
			className={'white-background'}
			style={{
				position: 'absolute',
				top: '0',
				left: '0',
				height: '100%',
				width: '100%',
				background: 'white',
				zIndex: '-2'
			}}
		/>
	);
};

export default WhiteSquareBackground;
