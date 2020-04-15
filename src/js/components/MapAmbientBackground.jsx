import React from 'react';
import { colorToWhiteArray } from 'js/utility/colorFunctions';

export const MapAmbientBackground = (props) => {
	const colorSelected = props.themeColor.available[props.themeColor.selected];
	let backgroundShapes = [];
	if (props.visualEffects) {
		const numberOfShapes = 20;
		const colorArray = colorToWhiteArray(colorSelected, numberOfShapes + 1);
		for (let i = 0; i < numberOfShapes; i++) {
			const backgroundShapeStyle = {
				backgroundColor: colorArray[i],
				animation: `spin ${15 + 0.25 * (i + 1)}s infinite linear`,
				height: `${100 - 4 * i}%`,
				width: `${100 - 4 * i}%`
			};
			backgroundShapes.push(<div key={i} className="mapBackgroundShape" style={backgroundShapeStyle} />);
		}
	} else backgroundShapes.push(<div style={{ width: '100%', height: '100%', backgroundColor: colorSelected }} />);
	return <div className="mapBackgroundContainer">{backgroundShapes}</div>;
};

export default MapAmbientBackground;
