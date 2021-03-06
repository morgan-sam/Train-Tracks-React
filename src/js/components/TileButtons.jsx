import React from 'react';
import { getCornerStyle } from 'js/styles/tileCornerBtn';
import { getAxisStyle } from 'js/styles/tileAxisBtn';
import { getCenterStyle } from 'js/styles/tileCenterBtn';

const CornerButton = (props) => {
	const cornerStyle = getCornerStyle(props.tileRemSize, props.corner);
	return <div className={`cornerButton ${props.corner}`} style={cornerStyle} />;
};

const AxisButton = (props) => {
	const axisStyle = getAxisStyle(props.tileRemSize, props.edge);
	return <div className={`axisButton ${props.edge}`} style={axisStyle} />;
};

const CentreButton = (props) => {
	const centerStyle = getCenterStyle(props.tileRemSize);
	return <div className={`centreButton`} style={centerStyle} />;
};

export const TileButtons = (props) => {
	const corners = [ 'top-left', 'top-right', 'bottom-left', 'bottom-right' ];
	const edges = [ 'top', 'right', 'bottom', 'left' ];
	return [
		corners.map((el, i) => <CornerButton key={`corner:${i}`} corner={el} tileRemSize={props.tileRemSize} />),
		edges.map((el, i) => <AxisButton key={`edge:${i}`} edge={el} tileRemSize={props.tileRemSize} />),
		<CentreButton key={'center'} tileRemSize={props.tileRemSize} />
	];
};

export default TileButtons;
