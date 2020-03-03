import React from 'react';
import Map from './map';
import WaveButton from './waveButton';
import { generateMapBackground } from '../generation/generateIcon';
import { print } from '../utility/utilityFunctions';

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gameWon: false,
			gameWinDisplay: false,
			saveMapDisplay: false,
			mapSaveName: null,
			defaultTilesHighlighted: false,
			mapSolutionVisible: false,
			saveBoxMapBackground: null
		};
		this.setGameWinState = this.setGameWinState.bind(this);
	}

	setSaveBoxBackground = async (boo) => {
		const img = boo ? await generateMapBackground(this.props.trainTrackMap) : null;
		this.setState({
			saveBoxMapBackground: img
		});
	};

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
		this.setSaveBoxBackground(boo);
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
				<div key={'winDisplayBackground'} className={'winDisplayBackground'}>
					{this.renderWinDisplayBackground()}
				</div>
			</div>
		);
	}

	renderWinDisplayBackground() {
		//
	}

	renderSaveMapDisplay() {
		return (
			<div key={'saveMapDisplay'} className="saveMapDisplay" onContextMenu={(e) => e.preventDefault()}>
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
				<WaveButton
					key={'confirmSaveMapBtn'}
					className={'confirmSaveMapBtn'}
					onClick={() => {
						this.props.saveMapToLocal(this.state.mapSaveName, this.props.trainTrackMap);
						this.setMapSaveName(null);
						this.showSaveMapDisplay(false);
					}}
					text={'Save Map'}
				/>
			</div>
		);
	}

	renderOptionsButtons() {
		return (
			<div className="inGameOptions">
				<div className="topRowInGameButtons">
					<WaveButton
						key={'resetMapBtn'}
						onClick={() => {
							this.refs.map.resetCurrentMap();
							this.setMapSolutionVisibility(false);
						}}
						text={'Reset Map'}
					/>
					<WaveButton
						key={'highlightDefaultTilesBtn'}
						onClick={() => this.setDefaultTilesHighlighted(!this.state.defaultTilesHighlighted)}
						text={this.state.defaultTilesHighlighted ? 'Hide Default Tiles' : 'Show Default Tiles'}
					/>
					<WaveButton
						key={'showMapSolutionBtn'}
						onClick={() => this.setMapSolutionVisibility(!this.state.mapSolutionVisible)}
						text={this.state.mapSolutionVisible ? 'Hide Map Solution' : 'Show Map Solution'}
					/>
				</div>
				<div className="bottomRowInGameButtons">
					<div className="mapSeedOptionContainer">
						<WaveButton
							className="mapSeedBtn"
							key="mapSeedBtn"
							onClick={() => {
								this.seedText.select();
								document.execCommand('copy');
							}}
							text={'🌱'}
						/>

						<div className="mapSeedExplanationContainer">
							<div className="mapSeedExplanationSubContainer">
								<p className="mapSeedExplanation">Copy map seed to clipboard</p>
							</div>
						</div>
						<textarea
							readOnly
							unselectable="on"
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								opacity: 0,
								width: 0,
								height: 0,
								resize: 'none',
								cursor: 'default'
							}}
							ref={(seedText) => (this.seedText = seedText)}
							value={this.props.mapSeed}
						/>
					</div>
					<WaveButton
						key={'saveMapBtn'}
						onClick={() => {
							this.showSaveMapDisplay(true);
							this.showGameWinDisplay(false);
						}}
						text={'Save Map'}
					/>

					<WaveButton
						key={'newMapBtn'}
						onClick={() => {
							this.props.newMap();
							this.showGameWinDisplay(false);
							this.setMapSolutionVisibility(false);
						}}
						text={'New Map'}
					/>

					<WaveButton
						key={'quitBtn'}
						onClick={() => {
							this.props.setSeedrandomToDate();
							this.props.setGameState(false);
						}}
						text={'Quit Game'}
					/>
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
						controlsActive={!this.state.saveMapDisplay}
						mapVisible={!this.state.saveBoxMapBackground}
					/>
					<img
						alt=""
						draggable="false"
						src={this.state.saveBoxMapBackground}
						className="saveBoxMapBackground"
						style={{
							position: 'absolute',
							top: '64px',
							left: '0px',
							border: this.state.saveBoxMapBackground ? '1px solid black' : 'none'
						}}
					/>
				</div>
				{optionsButtons}
			</div>
		);
	}
}

export default Game;
