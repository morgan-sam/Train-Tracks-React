import React from 'react';
import ReactDOM from 'react-dom';
import seedrandom from 'seedrandom';
import { generateNewMap, compareArrays, findDirectionFromMove } from './generateMap';
import './index.css';
import curvedtrack from './img/curvedtrack.png';
import straighttrack from './img/straighttrack.png';

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
        if (this.props.className.includes('mapTile')) {
            const tile = [this.props.x, this.props.y];
            if (
                (Array.isArray(this.props.leftClickDragArray) && this.props.leftClickDragArray.length) ||
                this.props.rightClickDragValue
            ) {
                this.props.hoverStartEvent(e, tile);
            } else {
                this.setHoverGhostTrack(e, tile);
            }
        }
    }

    squareHoverEnd(e) {
        this.removeHoverGhostTrack();
    }

    squareMouseDown(e) {
        const tile = [this.props.x, this.props.y];
        if (e.button === 0) {
            const trackSquare = {
                tile,
                railType: this.convertButtonClassToRailType(e)
            };
            this.props.leftClickEvent(trackSquare);
        }
        if (e.button === 2) {
            this.props.rightClickEvent(tile);
        }
    }

    squareMouseUp(e) {
        const coordinate = [this.props.x, this.props.y];
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
        return [labelText, labelStyling];
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
        return [squareStyling, trackText];
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
        return [squareStyling, trackText];
    }

    setDefaultTrackImage() {
        let squareStyling;
        squareStyling = {
            backgroundImage: `url(${this.props.trackData.trackType})`,
            transform: `rotate(${this.props.trackData.trackRotation}deg)`,
            opacity: 1
        };
        return [squareStyling, null];
    }

    ///////////// SQUARE - RENDER FUNCTIONS /////////////

    generateTileButtons() {
        let cornerButtons = null;
        let middleButtons = null;
        let centreButton = null;
        const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        const edges = ['top', 'right', 'bottom', 'left'];
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
        return [cornerButtons, middleButtons, centreButton];
    }

    render() {
        const [labelText, labelStyling] = this.setTableHeadingState();
        const [cornerButtons, middleButtons, centreButton] = this.generateTileButtons();
        let squareStyling, trackText;

        if (
            this.props.x === this.state.hoverTrack.tile[0] &&
            this.props.y === this.state.hoverTrack.tile[1] &&
            !this.props.trackData
        ) {
            [squareStyling, trackText] = this.setHoverTrackImage();
        }

        if (this.props.railImage && this.props.className === 'mapTile') {
            [squareStyling, trackText] = this.setPlacedTrackImage();
        }

        if (this.props.trackData && this.props.className === 'defaultTrack') {
            [squareStyling, trackText] = this.setDefaultTrackImage();
        }

        return (
            <div
				className={`square ${this.props.className}`}
				onContextMenu={(e) => e.preventDefault()}
				onMouseOver={this.props.className === 'mapTile' ? this.squareHoverStart : null}
				onMouseLeave={this.props.className === 'mapTile' ? this.squareHoverEnd : null}
				onMouseDown={this.props.className === 'mapTile' ? this.squareMouseDown : null}
				onMouseUp={this.props.className === 'mapTile' ? this.squareMouseUp : null}
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

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.leftClickEvent = this.leftClickEvent.bind(this);
        this.rightClickEvent = this.rightClickEvent.bind(this);
        this.leftReleaseEvent = this.leftReleaseEvent.bind(this);
        this.rightReleaseEvent = this.rightReleaseEvent.bind(this);
        this.hoverStartEvent = this.hoverStartEvent.bind(this);
        this.hoverEndEvent = this.hoverEndEvent.bind(this);
        this.placeTile = this.placeTile.bind(this);
        this.placeMultipleTiles = this.placeMultipleTiles.bind(this);

        this.state = {
            placedTracks: [],
            hoveredTile: []
        };
    }

    ///////////// MAP - MOUSE EVENTS FUNCTIONS /////////////

    leftClickEvent(trackSquareInfo) {
        this.currentHoverTile = trackSquareInfo.tile;
        this.placeMultipleTiles([trackSquareInfo]);
        this.leftClickDragArray = [null, null, trackSquareInfo.tile];
    }

    rightClickEvent(coordinate) {
        this.currentHoverTile = coordinate;
        const tileValue = this.getRailTypeOfCoordinate(coordinate);
        this.rightClickDragValue = tileValue === null ? 'X' : 'DELETE';
        if (this.getRailTypeOfCoordinate(coordinate)) {
            this.removePlacedTrack(coordinate);
        } else {
            this.placeTile(coordinate, this.rightClickDragValue);
        }
    }

    leftReleaseEvent() {
        this.leftClickDragArray = [];
        this.forceUpdate();
    }

    rightReleaseEvent() {
        this.rightClickDragValue = undefined;
        this.forceUpdate();
    }

    hoverStartEvent(e, coordinate) {
        let newHoverTile = false;
        if (!compareArrays(coordinate, this.currentHoverTile)) {
            this.previousHoverTile = this.currentHoverTile;
            this.currentHoverTile = coordinate;
            newHoverTile = true;
        }

        if (e.buttons === 1 && newHoverTile) {
            if (Array.isArray(this.leftClickDragArray) && this.leftClickDragArray.length) {
                this.placedDraggedTrack(coordinate);
            }
        }
        if (e.buttons === 2) {
            if (this.rightClickDragValue === 'X') {
                this.placeTile(coordinate, this.rightClickDragValue);
            } else if (this.rightClickDragValue === 'DELETE') {
                this.removePlacedTrack(coordinate);
            }
        }
    }

    hoverEndEvent(e, coordinate) {}

    ///////////// MAP - MOUSE DRAG CONTROL FUNCTIONS /////////////

    placedDraggedTrack(coordinate) {
        this.leftClickDragArray.shift();
        this.leftClickDragArray.push(coordinate);
        const directions = this.calculateDragDirection();
        const railType = this.convertDirectionsToRailType(directions);
        this.placeMultipleTiles([
            { tile: this.previousHoverTile, railType: railType[0] },
            { tile: this.currentHoverTile, railType: railType[1] }
        ]);
    }

    calculateDragDirection() {
        let directions = [];
        const tiles = this.leftClickDragArray;
        const numberOfNulls = tiles.findIndex((el) => el !== null);
        for (let i = numberOfNulls; i < tiles.length - 1; i++) {
            directions.push(findDirectionFromMove(tiles[i + 1], tiles[i]));
        }
        console.log(`directions: ${directions.join(' ')}`);
        return directions;
    }

    convertDirectionsToRailType(directions) {
        let previousTileRailType;
        let currentHoverTileRailType;
        if (directions.length === 1) {
            if (directions[0] % 2 === 0) previousTileRailType = 'vertical';
            if (directions[0] % 2 === 1) previousTileRailType = 'horizontal';
            currentHoverTileRailType = previousTileRailType;
        }
        if (directions.length === 2) {
            if (directions[0] % 2 === 0 && directions[1] % 2 === 0) previousTileRailType = 'vertical';
            if (directions[0] % 2 === 1 && directions[1] % 2 === 1) previousTileRailType = 'horizontal';

            if (directions[0] === 0 && directions[1] === 1) previousTileRailType = 'bottomRightCorner';
            if (directions[0] === 1 && directions[1] === 2) previousTileRailType = 'bottomLeftCorner';
            if (directions[0] === 2 && directions[1] === 3) previousTileRailType = 'topLeftCorner';
            if (directions[0] === 3 && directions[1] === 0) previousTileRailType = 'topRightCorner';

            if (directions[0] === 3 && directions[1] === 2) previousTileRailType = 'bottomRightCorner';
            if (directions[0] === 2 && directions[1] === 1) previousTileRailType = 'topRightCorner';
            if (directions[0] === 1 && directions[1] === 0) previousTileRailType = 'topLeftCorner';
            if (directions[0] === 0 && directions[1] === 3) previousTileRailType = 'bottomLeftCorner';

            currentHoverTileRailType = directions[1] % 2 === 0 ? 'vertical' : 'horizontal';
        }
        return [previousTileRailType, currentHoverTileRailType];
    }

    ///////////// MAP - TRACK PLACEMENT FUNCTIONS /////////////

    placeTile(coordinate, value) {
        const trackSquareInfo = {
            tile: coordinate,
            railType: value
        };
        this.placeMultipleTiles([trackSquareInfo]);
    }

    placeMultipleTiles(tileObjArr) {
        const placedTracks = this.state.placedTracks;
        let newTrackArray;
        //Remove any present tiles of passed track coordinates
        tileObjArr.forEach(function(el) {
            newTrackArray = placedTracks.filter(function(track) {
                if (!(track.tile[0] === el.tile[0] && track.tile[1] === el.tile[1])) return true;
            });
        });
        //Add track coordinates
        tileObjArr.forEach(function(el) {
            newTrackArray = [...newTrackArray, el];
        });
        this.setState({
            placedTracks: newTrackArray
        });
    }

    removePlacedTrack(trackCoordinates) {
        const filteredTracks = this.state.placedTracks.filter(function(track) {
            if (!(track.tile[0] === trackCoordinates[0] && track.tile[1] === trackCoordinates[1])) return true;
        });
        this.setState({
            placedTracks: filteredTracks
        });
    }

    ///////////// MAP - RETRIEVAL FUNCTIONS /////////////

    getRailTypeOfCoordinate(trackCoordinates) {
        let railType = null;
        this.state.placedTracks.forEach(function(el) {
            if (el.tile[0] === trackCoordinates[0] && el.tile[1] === trackCoordinates[1]) railType = el.railType;
        });
        return railType;
    }

    checkIfTileIsDefault(trainTrackMap, x, y) {
        let trackDefaultTile = null;
        trainTrackMap.tracks.forEach(function(el) {
            if (el.tile[0] === x && el.tile[1] === y && el.defaultTrack) trackDefaultTile = el.railType;
        });
        return trackDefaultTile;
    }

    getAllDefaultTiles(trainTrackMap) {
        let defaultTileArr = [];
        trainTrackMap.tracks.forEach(function(el) {
            if (el.defaultTrack) defaultTileArr.push(el);
        });
        return defaultTileArr;
    }

    ///////////// MAP - HEADING FUNCTIONS /////////////

    getRowColumnFillstate(axis, index) {
        let fillState = 'underfilled';
        const defaultTiles = this.getAllDefaultTiles(this.props.trainTrackMap);
        let axisNum = axis === 'x' ? 0 : 1;

        let placedTrackCount = defaultTiles.filter((el) => el.tile[axisNum] === index).length;
        const tilesOnAxis = this.props.trainTrackMap.tracks.filter((el) => el.tile[axisNum] === index).length;
        this.state.placedTracks.forEach(function(el) {
            if (el.tile[axisNum] === index && el.railType !== 'X') placedTrackCount++;
        });

        if (tilesOnAxis < placedTrackCount) {
            fillState = 'overfilled';
        } else if (tilesOnAxis === placedTrackCount) {
            fillState = 'full';
        }

        return fillState;
    }

    ///////////// MAP - RAIL IMAGE FUNCTIONS /////////////

    convertRailTypeToTrackImage(railType) {
        let trackData;
        if (railType === 'vertical') {
            trackData = {
                trackType: straighttrack,
                trackRotation: 0
            };
        } else if (railType === 'horizontal') {
            trackData = {
                trackType: straighttrack,
                trackRotation: 90
            };
        } else if (railType === 'bottomLeftCorner') {
            trackData = {
                trackType: curvedtrack,
                trackRotation: 0
            };
        } else if (railType === 'topLeftCorner') {
            trackData = {
                trackType: curvedtrack,
                trackRotation: 90
            };
        } else if (railType === 'topRightCorner') {
            trackData = {
                trackType: curvedtrack,
                trackRotation: 180
            };
        } else if (railType === 'bottomRightCorner') {
            trackData = {
                trackType: curvedtrack,
                trackRotation: 270
            };
        } else if (railType === 'T' || railType === 'X') {
            trackData = { trackType: railType, trackRotation: 'none' };
        } else {
            trackData = { trackType: 'none', trackRotation: 'none' };
        }
        return trackData;
    }

    ///////////// MAP - RENDER FUNCTIONS /////////////

    renderHeadingTile(i, headerLabel, fillState) {
        return <Square className="table-heading" key={i} text={headerLabel} fillState={fillState} />;
    }

    renderMapTile(i, x, y, railImage) {
        return (
            <Square
				className="mapTile"
				key={i}
				x={x}
				y={y}
				convertRailTypeToTrackImage={this.convertRailTypeToTrackImage}
				railImage={railImage}
				leftClickEvent={this.leftClickEvent}
				rightClickEvent={this.rightClickEvent}
				leftReleaseEvent={this.leftReleaseEvent}
				rightReleaseEvent={this.rightReleaseEvent}
				hoverStartEvent={this.hoverStartEvent}
				hoverEndEvent={this.hoverEndEvent}
				leftClickDragArray={this.leftClickDragArray}
				rightClickDragValue={this.rightClickDragValue}
			/>
        );
    }

    renderDefaultTrack(i, x, y, defaultRailType) {
        return (
            <Square
				className="defaultTrack"
				key={i}
				x={x}
				y={y}
				trackData={this.convertRailTypeToTrackImage(defaultRailType)}
			/>
        );
    }

    render() {
        window.state = this.state;
        const trainTrackMap = this.props.trainTrackMap;
        const convertRailTypeToTrackImage = this.convertRailTypeToTrackImage;
        let mapComponents = [];
        for (let y = 0; y < this.props.mapHeight + 1; y++) {
            mapComponents.push(
                <div className="mapRow" key={y}>
					{[ ...Array(this.props.mapWidth + 1) ].map((el, x) => {
						// const tileNumber = (this.props.mapHeight - 1) * y + x;
						const defaultTile = this.checkIfTileIsDefault(trainTrackMap, x, y - 1);
						//Place Map Headers
						if (y === 0) {
							const headerLabel = trainTrackMap.headerLabels.x[x];
							const fillState = this.getRowColumnFillstate('x', x);
							return this.renderHeadingTile(x, headerLabel, fillState);
						} else if (x === this.props.mapWidth) {
							const headerLabel = trainTrackMap.headerLabels.y[y - 1];
							const fillState = this.getRowColumnFillstate('y', y - 1);
							return this.renderHeadingTile(x, headerLabel, fillState);
						} else if (defaultTile) {
							//Place Default Tracks
							return this.renderDefaultTrack(x, x, y - 1, defaultTile);
						} else {
							//Place User Placed Tracks
							let railImage;
							this.state.placedTracks.forEach(function(el) {
								if (el.tile[0] === x && el.tile[1] === y - 1) {
									railImage = convertRailTypeToTrackImage(el.railType);
								}
							});
							if (railImage) {
								return this.renderMapTile(x, x, y - 1, railImage);
							} else {
								return this.renderMapTile(x, x, y - 1, null);
							}
						}
					})}
				</div>
            );
        }
        return <div className="map"> {mapComponents}</div>;
    }
}

class App extends React.Component {
    render() {
        const mapHeight = 6;
        const mapWidth = 5;
        const trainTrackMap = generateNewMap(mapWidth, mapHeight);

        return (
            <div>
				<h1 className="title">Train Tracks</h1>
				<Map trainTrackMap={trainTrackMap} mapHeight={mapHeight} mapWidth={mapWidth} />
			</div>
        );
    }
}
const seed = Math.random();
// console.log(seed);
// seedrandom(0.5989607919685986, { global: true });
seedrandom(seed, { global: true });

//testing:
//0.5128255307739107
//0.5961328806995592

//no track seeds:
//0.6113545021869811
//0.44704210096626085

//example where track wraps around end coordinate:
//0.2804289302017666

//example where track choses between end coordinate and dead end:
//0.38681828038735433
ReactDOM.render(<App />, document.getElementById('root'));