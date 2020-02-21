import React from 'react';
import Map from './map';

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gameWon: false,
			gameWinDisplay: false,
			saveMapDisplay: false,
			mapSaveName: null,
			defaultTilesHighlighted: false,
			mapSolutionVisible: false
		};
		this.setGameWinState = this.setGameWinState.bind(this);
	}

	setGameWinState(boo) {
		this.setState({
			gameWon: boo
		});
		this.showGameWinDisplay(boo);
	}

	setMapSaveName(name) {
		this.setState({
			mapSaveName: name
		});
	}

	setDefaultTilesHighlighted(boo) {
		this.setState({
			defaultTilesHighlighted: boo
		});
	}

	setMapSolutionVisibility(boo) {
		this.setState({
			mapSolutionVisible: boo
		});
	}

	showGameWinDisplay(boo) {
		this.setState({
			gameWinDisplay: boo
		});
	}
	showSaveMapDisplay(boo) {
		this.setState({
			saveMapDisplay: boo
		});
	}

	renderGameWinDisplay() {
		return (
			<div key={'gameWinDisplay'} className="popUpWindow winDisplay" onContextMenu={(e) => e.preventDefault()}>
				You Win!
				<button
					key={'closeWinDisplay'}
					className={'closePopUpWindow'}
					onClick={() => this.showGameWinDisplay(false)}
				>
					X
				</button>
			</div>
		);
	}

	renderSaveMapDisplay() {
		return (
			<div
				key={'saveMapDisplay'}
				className="popUpWindow saveMapDisplay"
				onContextMenu={(e) => e.preventDefault()}
			>
				<p>Enter a name to save map as:</p>
				<button
					key={'closeSaveMapDisplay'}
					className={'closePopUpWindow'}
					onClick={() => this.showSaveMapDisplay(false)}
				>
					X
				</button>
				<input
					key={'saveNameInputBox'}
					className={'saveNameInputBox'}
					onChange={(e) => this.setMapSaveName(e.target.value)}
				/>
				<button
					key={'confirmSaveMapBtn'}
					className={'confirmSaveMapBtn'}
					onClick={() => {
						this.props.saveMapToLocal(this.state.mapSaveName, this.props.trainTrackMap);
						this.setMapSaveName(null);
						this.showSaveMapDisplay(false);
					}}
				>
					Save Map
				</button>
			</div>
		);
	}

	renderOptionsButtons() {
		return (
			<div className="inGameOptions">
				<div>
					<button
						key={'resetMapBtn'}
						onClick={() => {
							this.refs.map.resetCurrentMap();
							this.setMapSolutionVisibility(false);
						}}
					>
						Reset Map
					</button>
					<button
						key={'highlightDefaultTilesBtn'}
						onClick={() => this.setDefaultTilesHighlighted(!this.state.defaultTilesHighlighted)}
					>
						{this.state.defaultTilesHighlighted ? 'Hide' : 'Show'} Default Tiles
					</button>
					<button
						key={'showMapSolutionBtn'}
						onClick={() => this.setMapSolutionVisibility(!this.state.mapSolutionVisible)}
					>
						{this.state.mapSolutionVisible ? 'Hide' : 'Show'} Map Solution
					</button>
				</div>
				<div>
					<button
						key={'saveMapBtn'}
						onClick={() => {
							this.showSaveMapDisplay(true);
							this.showGameWinDisplay(false);
						}}
					>
						Save Map
					</button>
					<button
						key={'newMapBtn'}
						onClick={() => {
							this.props.newMap();
							this.showGameWinDisplay(false);
							this.setMapSolutionVisibility(false);
						}}
					>
						New Map
					</button>
					<button
						key={'quitBtn'}
						onClick={() => {
							this.props.setSeedrandomToDate();
							this.props.setGameState(false);
						}}
					>
						Quit Game
					</button>
				</div>
			</div>
		);
	}

	render() {
		let gameWinDisplay, saveMapDisplay;
		if (this.state.gameWinDisplay) gameWinDisplay = this.renderGameWinDisplay();
		if (this.state.saveMapDisplay) saveMapDisplay = this.renderSaveMapDisplay();

		const optionsButtons = this.renderOptionsButtons();
		return (
			<div>
				<div className="gameMapContainer">
					{gameWinDisplay}
					{saveMapDisplay}
					<Map
						ref="map"
						key={this.props.mapSeed}
						className="gameMap"
						defaultTilesHighlighted={this.state.defaultTilesHighlighted}
						mapSolutionVisible={this.state.mapSolutionVisible}
						trainTrackMap={this.props.trainTrackMap}
						mapHeight={this.props.mapHeight}
						mapWidth={this.props.mapWidth}
						setGameWinState={this.setGameWinState}
					/>
				</div>
				{optionsButtons}
				<br />
				<p>
					<span>Map Seed: {this.props.mapSeed}</span>
				</p>
			</div>
		);
	}
}

export default Game;
