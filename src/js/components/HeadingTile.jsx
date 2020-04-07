import React from 'react';
import { getSquareStyle } from '../styles/square';

export const HeadingTile = (props) => {
	function convertFillStateToColor(fillState) {
		switch (fillState) {
			case 'underfilled':
				return 'black';
			case 'full':
				return 'green';
			case 'overfilled':
				return 'red';
			default:
				return 'black';
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
				<p className="boxLabel" style={{ color: convertFillStateToColor(props.fillState) }}>
					{props.headerLabel}
				</p>
			</div>
		</div>
	);
};

export default HeadingTile;
