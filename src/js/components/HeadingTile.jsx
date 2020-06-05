import React from 'react';
import { getSquareStyle } from 'js/styles/square';

export const HeadingTile = (props) => {
	const convertFillStateToStyle = (fillState) => {
		switch (fillState) {
			case 'underfilled':
				return {
					WebkitTextFillColor: 'white',
					WebkitTextStrokeColor: 'black'
				};
			case 'full':
				return {
					WebkitTextFillColor: 'green',
					WebkitTextStrokeColor: 'white'
				};
			case 'overfilled':
				return {
					WebkitTextFillColor: 'red',
					WebkitTextStrokeColor: 'white'
				};
			default:
				return {
					WebkitTextFillColor: 'white',
					WebkitTextStrokeColor: 'black'
				};
		}
	}

	const headerTextBoxStyle = {
		width: '100%',
		height: '100%',
		border: '1px solid black',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	};

	return (
		<div style={getSquareStyle(props.tileRemSize)} className={`square`} onContextMenu={(e) => e.preventDefault()}>
			<div style={headerTextBoxStyle}>
				<p className="boxLabel" style={convertFillStateToStyle(props.fillState)}>
					{props.headerLabel}
				</p>
			</div>
		</div>
	);
};

export default HeadingTile;
