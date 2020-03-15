import React, { useState } from 'react';
import { convertRailTypeToTrackImage } from '../utility/trackConversions';
import { CornerButton, MiddleButton, CentreButton } from './SquareButtons';

export const Square = (props) => {
	const [ hoverTrack, setHoverTrack ] = useState({
		tile: '-',
		railType: '-'
	});

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
		if (e.buttons === 0) {
			setHoverGhostTrack(mouseEventObject);
		}
	}

	function squareHoverEnd(e) {
		const tileClass = getTileClassFromEvent(e);
		removeHoverGhostTrack();
		props.hoverEndEvent(tileClass);
	}

	function squareMouseDown(e) {
		const mouseEventObject = getMouseEventObject(e);
		if (mouseEventObject.mouseButton === 1) {
			props.leftClickEvent(mouseEventObject);
		}
		if (mouseEventObject.mouseButton === 2) {
			props.rightClickEvent(mouseEventObject);
		}
		if (mouseEventObject.mouseButton === 3) {
			props.bothClickEvent(mouseEventObject);
		}
	}

	function squareMouseUp(e) {
		const mouseEventObject = getMouseEventObject(e);
		if (e.button === 0) {
			props.leftReleaseEvent(mouseEventObject);
		}
		if (e.button === 2) {
			props.rightReleaseEvent();
		}
	}

	///////////// SQUARE - HOVER GHOST TRACK FUNCTIONS /////////////

	function setHoverGhostTrack(mouseEventObject) {
		setHoverTrack({
			tile: mouseEventObject.tile,
			railType: mouseEventObject.railType
		});
	}

	function removeHoverGhostTrack() {
		setHoverTrack({
			tile: '-',
			railType: '-'
		});
	}

	///////////// SQUARE - CLASSNAME CONVERSION FUNCTIONS /////////////

	function getTileClassFromEvent(e) {
		const classList = e.currentTarget.className;
		let tileClass;
		if (classList.includes('mapTile')) tileClass = 'mapTile';
		if (classList.includes('defaultTrack')) tileClass = 'defaultTrack';
		if (classList.includes('table-heading')) tileClass = 'table-heading';
		return tileClass;
	}

	function convertButtonClassToRailType(e) {
		let railType;
		if (e.target.classList.contains('middleButton')) {
			if (e.target.classList.contains('top') || e.target.classList.contains('bottom')) {
				railType = 'vertical';
			}
			if (e.target.classList.contains('right') || e.target.classList.contains('left')) {
				railType = 'horizontal';
			}
		}
		if (e.target.classList.contains('cornerButton')) {
			if (e.target.classList.contains('top-left')) {
				railType = 'topLeftCorner';
			}
			if (e.target.classList.contains('top-right')) {
				railType = 'topRightCorner';
			}
			if (e.target.classList.contains('bottom-left')) {
				railType = 'bottomLeftCorner';
			}
			if (e.target.classList.contains('bottom-right')) {
				railType = 'bottomRightCorner';
			}
		}
		if (e.target.classList.contains('centreButton')) {
			railType = 'T';
		}
		return railType;
	}

	///////////// SQUARE - HEADING FUNCTIONS /////////////

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

	///////////// SQUARE - RAIL IMAGE FUNCTIONS /////////////

	function setHoverTrackImage() {
		let squareStyling, trackText;
		const trackImage = convertRailTypeToTrackImage(hoverTrack.railType);
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

	function generateTileButtons() {
		let cornerButtons = null;
		let middleButtons = null;
		let centreButton = null;
		const corners = [ 'top-left', 'top-right', 'bottom-left', 'bottom-right' ];
		const edges = [ 'top', 'right', 'bottom', 'left' ];
		if (props.className === 'mapTile') {
			cornerButtons = corners.map((el) => <CornerButton corner={el} key={el} />);
			middleButtons = edges.map((el) => <MiddleButton edge={el} key={el} />);
			centreButton = <CentreButton />;
		}
		return [ cornerButtons, middleButtons, centreButton ];
	}

	function squareIsHoverTile() {
		return props.x === hoverTrack.tile[0] && props.y === hoverTrack.tile[1];
	}

	function renderWhiteBackground() {
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
	}

	const [ cornerButtons, middleButtons, centreButton ] = generateTileButtons();
	let squareStyling, trackText, boxStyling;

	if (!props.trackData && squareIsHoverTile()) {
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
			className={`square ${props.className}`}
			onContextMenu={(e) => e.preventDefault()}
			onMouseOver={props.className !== 'table-heading' ? (e) => squareHoverStart(e) : null}
			onMouseLeave={props.className !== 'table-heading' ? (e) => squareHoverEnd(e) : null}
			onMouseDown={props.className !== 'table-heading' ? (e) => squareMouseDown(e) : null}
			onMouseUp={props.className !== 'table-heading' ? (e) => squareMouseUp(e) : null}
		>
			<div className={`box`} style={boxStyling}>
				{cornerButtons}
				{middleButtons}
				{centreButton}
				<p className="boxLabel" style={{ color: convertFillStateToColor(props.fillState) }}>
					{props.text}
				</p>
			</div>
			<div className={'track-background'} style={squareStyling}>
				{trackText}
			</div>
			{renderWhiteBackground()}
		</div>
	);
};

export default Square;
