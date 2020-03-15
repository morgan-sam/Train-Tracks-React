import React from 'react';

export const WhiteSquareBackground = (props) => {
	let transitionSpeed;
	if (props.className === 'table-heading') transitionSpeed = 0;
	if (props.className === 'emptyTile') transitionSpeed = 1;
	if (props.className === 'transparentTile') transitionSpeed = 0;

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
				zIndex: '-2',
				transition: `opacity ${transitionSpeed}s`,
				opacity:
					props.className === 'table-heading' ||
					props.className === 'emptyTile' ||
					props.className === 'transparentTile'
						? '0'
						: '1'
			}}
		/>
	);
};

export default WhiteSquareBackground;
