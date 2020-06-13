import React from 'react';
import { getSquareStyle } from 'js/styles/square';

export const EmptyTile = (props) => {
	const emptyTileStyle = {
		...getSquareStyle(props.tileRemSize)
	};
	const squareStyling = {
		border: '1px solid black',
		zIndex: '1'
	};
	return (
		<div style={emptyTileStyle}>
			<div className={'tile-display'} style={squareStyling} />
		</div>
	);
};

export default EmptyTile;
