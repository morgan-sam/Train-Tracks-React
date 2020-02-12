import React from 'react';
import Map from './map';

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gameWon: false,
			gameWinDisplay: false
		};
		this.setGameWinState = this.setGameWinState.bind(this);
	}

	setGameWinState(boo) {
		this.setState({
			gameWon: boo
		});
		this.showGameWinDisplay(true);
	}

	showGameWinDisplay(boo) {
		this.setState({
			gameWinDisplay: boo
		});
	}

	renderGameWinDisplay() {
		return (
			<div key={'gameWinDisplay'} className="gameWinDisplay" onContextMenu={(e) => e.preventDefault()}>
				You Win!
				<button
					key={'closeWinDisplay'}
					className={'closeWinDisplay'}
					onClick={() => this.showGameWinDisplay(false)}
				>
					X
				</button>
			</div>
		);
	}

	renderOptionsButtons() {
		return (
			<div>
				<button key={'resetMapBtn'} onClick={() => null}>
					Reset Map
				</button>
				<button key={'quitBtn'} onClick={() => null}>
					Save Map
				</button>
				<button key={'newMapBtn'} onClick={() => null}>
					New Map
				</button>
				<button key={'quitBtn'} onClick={() => this.props.setGameState(false)}>
					Quit Game
				</button>
			</div>
		);
	}

	render() {
		let gameWinDisplay;
		if (this.state.gameWinDisplay) {
			gameWinDisplay = this.renderGameWinDisplay();
		}
		const optionsButtons = this.renderOptionsButtons();
		return (
			<div>
				<div className="gameMapContainer">
					{gameWinDisplay}
					<Map
						className="gameMap"
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
