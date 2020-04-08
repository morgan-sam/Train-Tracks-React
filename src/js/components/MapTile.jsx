import React, { useState } from 'react';
import WhiteSquareBackground from './WhiteSquareBackground';
import { convertRailTypeToTrackImage, convertButtonClassToRailType } from '../trackCalculations/railTypeProcessing';
import { TileButtons } from './TileButtons';
import { getSquareStyle } from '../styles/square';

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

	///////////// SQUARE - RAIL IMAGE FUNCTIONS /////////////

	function setHoverTrackImage() {
		let squareStyling, trackText;
		const trackImage = convertRailTypeToTrackImage(hoverTrack);
		if (trackImage.trackType !== 'T') {
			squareStyling = {
				backgroundImage: `url(${trackImage.trackType})`,
				transform: `rotate(${trackImage.trackRotation}deg)`,
				opacity: 0.5
			};
		} else {
			trackText = trackImage.trackType;
			squareStyling = {
				opacity: 0.5
			};
		}
		return [ squareStyling, trackText ];
	}

	function setPlacedTrackImage() {
		let squareStyling, trackText;
		if (props.trackData.trackType !== 'T' && props.trackData.trackType !== 'X') {
			squareStyling = {
				backgroundImage: `url(${props.trackData.trackType})`,
				transform: `rotate(${props.trackData.trackRotation}deg)`,
				opacity: 1
			};
		} else {
			trackText = props.trackData.trackType;
			squareStyling = {
				opacity: 1
			};
		}
		return [ squareStyling, trackText ];
	}

	function setDefaultTrackImage() {
		let squareStyling;
		squareStyling = {
			backgroundImage: `url(${props.trackData.trackType})`,
			transform: `rotate(${props.trackData.trackRotation}deg)`,
			opacity: 1,
			filter: props.highlighted ? 'hue-rotate(200deg) saturate(10)' : 'none',
			transition: 'filter 1s ease-in-out'
		};
		return [ squareStyling, null ];
	}

	///////////// SQUARE - RENDER FUNCTIONS /////////////

	let squareStyling, trackText, boxStyling;

	if (!props.trackData && hoverTrack) {
		[ squareStyling, trackText ] = setHoverTrackImage();
	}

	if (props.className === 'mapTile') {
		if (props.trackData) {
			[ squareStyling, trackText ] = setPlacedTrackImage();
		}
	}

	if (
		(props.trackData && props.className === 'defaultTrack') ||
		(props.trackData && props.className === 'completeTrack')
	) {
		[ squareStyling, trackText ] = setDefaultTrackImage();
	}

	if (props.className === 'transparentTile') {
		boxStyling = { border: 'none' };
		squareStyling = { border: 'none' };
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
			<WhiteSquareBackground {...props} />
		</div>
	);
};

export default Square;
