import React from 'react';
import { getSquareStyle } from '../styles/square';

export const TransparentTile = (props) => {
	const transparentTileStyle = {
		...getSquareStyle(props.tileRemSize),
		zIndex: '-2',
		opacity: '0'
	};

	return <div style={transparentTileStyle} />;
};

export default TransparentTile;
