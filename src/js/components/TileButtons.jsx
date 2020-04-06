import React from 'react';
import { getCornerStyle } from '../styles/tileCornerBtn';
import { getAxisStyle } from '../styles/tileAxisBtn';
const BOX_DIM_REM = 3.8;

const CornerButton = (props) => {
	const cornerStyle = getCornerStyle(BOX_DIM_REM, props.corner);
	return <div className={`cornerButton ${props.corner}`} style={cornerStyle} />;
};

const AxisButton = (props) => {
	const axisStyle = getAxisStyle(BOX_DIM_REM, props.edge);
	return <div className={`axisButton ${props.edge}`} style={axisStyle} />;
};

const CentreButton = () => {
	return <div className={`centreButton`} />;
};

export const TileButtons = (props) => {
	const corners = [ 'top-left', 'top-right', 'bottom-left', 'bottom-right' ];
	const edges = [ 'top', 'right', 'bottom', 'left' ];
	return [
		corners.map((el) => <CornerButton corner={el} key={el} />),
		edges.map((el) => <AxisButton edge={el} key={el} />),
		<CentreButton key={props.x} />
	];
};
