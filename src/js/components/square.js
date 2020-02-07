import React from 'react';
import ReactDOM from 'react-dom';

function CornerButton(props) {
	return (
		<div
			className={`cornerButton ${props.corner}`}
			onClick={props.clickEvent}
			onMouseOver={props.hoverEvent}
			onMouseLeave={props.hoverEnd}
		/>
	);
}

function MiddleButton(props) {
	return (
		<div
			className={`middleButton ${props.edge}`}
			onClick={props.clickEvent}
			onMouseOver={props.hoverEvent}
			onMouseLeave={props.hoverEnd}
		/>
	);
}

function CentreButton(props) {
	return (
		<div
			className={`centreButton`}
			onClick={props.clickEvent}
			onMouseOver={props.hoverEvent}
			onMouseLeave={props.hoverEnd}
		/>
	);
}

class Square extends React.Component {
	constructor(props) {
		super(props);
		this.squareHoverStart = this.squareHoverStart.bind(this);
		this.squareHoverEnd = this.squareHoverEnd.bind(this);
		this.squareMouseDown = this.squareMouseDown.bind(this);
		this.squareMouseUp = this.squareMouseUp.bind(this);

		this.state = {
			hoverTrack: {
				tile: '-',
				railType: '-'
			}
		};
	}

	///////////// SQUARE - MOUSE EVENTS FUNCTIONS /////////////

	squareHoverStart(e) {
		const tile = [ this.props.x, this.props.y ];
		if (
			(Array.isArray(this.props.leftClickDragArray) && this.props.leftClickDragArray.length) ||
			this.props.rightClickDragValue
		) {
			this.props.hoverStartEvent(e, tile);
		} else {
			if (this.props.className.includes('mapTile')) {
				this.setHoverGhostTrack(e, tile);
			}
		}
	}

	squareHoverEnd(e) {
		this.removeHoverGhostTrack();
	}

	squareMouseDown(e) {
		const tileClass = this.getTileClassFromEvent(e);
		const tile = [ this.props.x, this.props.y ];
		if (e.button === 0) {
			const trackSquare = {
				tile,
				railType: this.convertButtonClassToRailType(e)
			};
			this.props.leftClickEvent(trackSquare, tileClass);
		}
		if (e.button === 2) {
			this.props.rightClickEvent(tile, tileClass);
		}
	}

	squareMouseUp(e) {
		const coordinate = [ this.props.x, this.props.y ];
		if (e.button === 0) {
			this.props.leftReleaseEvent(coordinate);
		}
		if (e.button === 2) {
			this.props.rightReleaseEvent(coordinate);
		}
	}

	///////////// SQUARE - HOVER GHOST TRACK FUNCTIONS /////////////

	setHoverGhostTrack(e, tile) {
		const railType = this.convertButtonClassToRailType(e);
		this.setState({
			hoverTrack: {
				tile,
				railType
			}
		});
	}

	removeHoverGhostTrack() {
		this.setState({
			hoverTrack: {
				tile: '-',
				railType: '-'
			}
		});
	}

	///////////// SQUARE - CLASSNAME CONVERSION FUNCTIONS /////////////

	getTileClassFromEvent(e) {
		const classList = e.currentTarget.className;
		let tileClass;
		if (classList.includes('mapTile')) tileClass = 'mapTile';
		if (classList.includes('defaultTrack')) tileClass = 'defaultTrack';
		if (classList.includes('table-heading')) tileClass = 'table-heading';
		return tileClass;
	}

	convertButtonClassToRailType(e) {
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

	setTableHeadingState() {
		let labelText, labelStyling;
		if (this.props.className === 'table-heading') {
			switch (this.props.fillState) {
				case 'underfilled':
					labelStyling = {
						color: 'black'
					};
					break;
				case 'full':
					labelStyling = {
						color: 'green'
					};
					break;
				case 'overfilled':
					labelStyling = {
						color: 'red'
					};
					break;
				default:
					labelStyling = {
						color: 'black'
					};
			}
			labelText = this.props.text;
		}
		return [ labelText, labelStyling ];
	}

	///////////// SQUARE - RAIL IMAGE FUNCTIONS /////////////

	setHoverTrackImage() {
		let squareStyling, trackText;
		const trackImage = this.props.convertRailTypeToTrackImage(this.state.hoverTrack.railType);
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

	setPlacedTrackImage() {
		let squareStyling, trackText;
		if (this.props.railImage.trackType !== 'T' && this.props.railImage.trackType !== 'X') {
			squareStyling = {
				backgroundImage: `url(${this.props.railImage.trackType})`,
				transform: `rotate(${this.props.railImage.trackRotation}deg)`,
				opacity: 1
			};
		} else {
			trackText = this.props.railImage.trackType;
			squareStyling = {
				opacity: 1
			};
		}
		return [ squareStyling, trackText ];
	}

	setDefaultTrackImage() {
		let squareStyling;
		squareStyling = {
			backgroundImage: `url(${this.props.trackData.trackType})`,
			transform: `rotate(${this.props.trackData.trackRotation}deg)`,
			opacity: 1
		};
		return [ squareStyling, null ];
	}

	///////////// SQUARE - RENDER FUNCTIONS /////////////

	generateTileButtons() {
		let cornerButtons = null;
		let middleButtons = null;
		let centreButton = null;
		const corners = [ 'top-left', 'top-right', 'bottom-left', 'bottom-right' ];
		const edges = [ 'top', 'right', 'bottom', 'left' ];
		if (this.props.className === 'mapTile') {
			cornerButtons = corners.map((el) => (
				<CornerButton
					corner={el}
					key={el}
					clickEvent={this.mouseButtonDown}
					hoverEvent={this.hoverEventActive}
					hoverEnd={this.hoverEventDisabled}
				/>
			));
			middleButtons = edges.map((el) => (
				<MiddleButton
					edge={el}
					key={el}
					clickEvent={this.mouseButtonDown}
					hoverEvent={this.hoverEventActive}
					hoverEnd={this.hoverEventDisabled}
				/>
			));
			centreButton = (
				<CentreButton
					clickEvent={this.mouseButtonDown}
					hoverEvent={this.hoverEventActive}
					hoverEnd={this.hoverEventDisabled}
				/>
			);
		}
		return [ cornerButtons, middleButtons, centreButton ];
	}

	render() {
		const [ labelText, labelStyling ] = this.setTableHeadingState();
		const [ cornerButtons, middleButtons, centreButton ] = this.generateTileButtons();
		let squareStyling, trackText;

		if (
			this.props.x === this.state.hoverTrack.tile[0] &&
			this.props.y === this.state.hoverTrack.tile[1] &&
			!this.props.trackData
		) {
			[ squareStyling, trackText ] = this.setHoverTrackImage();
		}

		if (this.props.railImage && this.props.className === 'mapTile') {
			[ squareStyling, trackText ] = this.setPlacedTrackImage();
		}

		if (this.props.trackData && this.props.className === 'defaultTrack') {
			[ squareStyling, trackText ] = this.setDefaultTrackImage();
		}

		return (
			<div
				className={`square ${this.props.className}`}
				onContextMenu={(e) => e.preventDefault()}
				onMouseOver={this.props.className !== 'table-heading' ? this.squareHoverStart : null}
				onMouseLeave={this.props.className !== 'table-heading' ? this.squareHoverEnd : null}
				onMouseDown={this.props.className !== 'table-heading' ? this.squareMouseDown : null}
				onMouseUp={this.props.className !== 'table-heading' ? this.squareMouseUp : null}
			>
				<div className={`box`}>
					{cornerButtons}
					{middleButtons}
					{centreButton}
					<p className="boxLabel" style={labelStyling}>
						{labelText}
					</p>
				</div>
				<div className={'track-background'} style={squareStyling}>
					{trackText}
				</div>
			</div>
		);
	}
}

export default Square;
