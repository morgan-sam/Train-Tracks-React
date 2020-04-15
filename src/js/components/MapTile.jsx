import React, { useState } from 'react';
import WhiteSquareBackground from 'js/components/WhiteSquareBackground';
import TileButtons from 'js/components/TileButtons';
import { convertButtonClassToRailType } from 'js/trackFunctions/railTypeProcessing';
import { setHoverTrackImage, setPlacedTrackImage, setDefaultTrackImage } from 'js/trackFunctions/railImageProcessing';
import { getSquareStyle } from 'js/styles/square';

export const Square = (props) => {
	const [ hoverTrack, setHoverTrack ] = useState(null);

	///////////// SQUARE - MOUSE EVENTS FUNCTIONS /////////////

	function getMouseEventObject(e) {
		const mouseEventObject = {
			tile: [ props.x, props.y ],
			railType: convertButtonClassToRailType(e),
			tileClass: getTileClassFromEvent(e),
			mouseButton: e.buttons
		};
		return mouseEventObject;
	}

	function squareHoverStart(e) {
		const mouseEventObject = getMouseEventObject(e);
		props.hoverStartEvent(mouseEventObject);
		if (e.buttons === 0) setHoverTrack(mouseEventObject.railType);
	}

	function squareHoverEnd(e) {
		setHoverTrack(null);
	}

	function squareMouseDown(e) {
		const mouseEventObject = getMouseEventObject(e);
		if (mouseEventObject.mouseButton === 1) props.leftClickEvent(mouseEventObject);
		if (mouseEventObject.mouseButton === 2) props.rightClickEvent(mouseEventObject);
		if (mouseEventObject.mouseButton === 3) props.bothClickEvent(mouseEventObject);
	}

	function squareMouseUp(e) {
		const mouseEventObject = getMouseEventObject(e);
		if (e.button === 0) props.leftReleaseEvent(mouseEventObject);
		if (e.button === 2) props.rightReleaseEvent();
	}

	///////////// SQUARE - CLASSNAME CONVERSION FUNCTIONS /////////////

	function getTileClassFromEvent(e) {
		const classList = e.currentTarget.className;
		let tileClass;
		if (classList.includes('mapTile')) tileClass = 'mapTile';
		if (classList.includes('defaultTrack')) tileClass = 'defaultTrack';
		return tileClass;
	}

	///////////// SQUARE - RENDER FUNCTIONS /////////////

	let squareStyling, trackText, boxStyling;

	if (!props.trackData && hoverTrack) {
		squareStyling = setHoverTrackImage(hoverTrack, props.railImages.unknown);
	}

	if (props.className === 'mapTile') {
		if (props.trackData) {
			squareStyling = setPlacedTrackImage(props.trackData, props.railImages);
		}
	}

	if (
		(props.trackData && props.className === 'defaultTrack') ||
		(props.trackData && props.className === 'completeTrack')
	) {
		squareStyling = setDefaultTrackImage(props.trackData, props.highlighted);
	}

	let backgroundEnabled = true;
	if (props.className === 'mapTile') {
		if (props.trackData) backgroundEnabled = props.trackData.trackType !== 'T';
		else if (hoverTrack) backgroundEnabled = hoverTrack !== 'T';
	}

	return (
		<div
			style={getSquareStyle(props.tileRemSize)}
			className={`square ${props.className}`}
			onContextMenu={(e) => e.preventDefault()}
			onMouseOver={(e) => squareHoverStart(e)}
			onMouseLeave={(e) => squareHoverEnd(e)}
			onMouseDown={(e) => squareMouseDown(e)}
			onMouseUp={(e) => squareMouseUp(e)}
		>
			<div className={`tile-button-container`} style={boxStyling}>
				<TileButtons {...props} />
			</div>
			<div className={'tile-display'} style={squareStyling}>
				{trackText}
			</div>
			{/* {backgroundEnabled && <WhiteSquareBackground {...props} />} */}
		</div>
	);
};

export default Square;
