import React, { useEffect, useState } from 'react';
import '../../css/howToPlayScreen.css';
import ReturnToMainMenuBtn from '../components/ReturnToMainMenuBtn.jsx';
import { generateNewMap } from '../generation/generateMap';
import { generateMapIcon } from '../generation/generateIcon';

export const HowToPlayScreen = (props) => {
	const [ maps, setMaps ] = useState(false);

	useEffect(() => {
		async function getMaps() {
			const gameParameters = { size: 6, seed: 986707260499975, difficulty: 3 };
			const map = generateNewMap(gameParameters);
			const emptyMap = await generateMapIcon(map, false);
			const completeMap = await generateMapIcon(map, true);
			setMaps({ empty: emptyMap, complete: completeMap });
		}
		getMaps();
	}, []);

	return (
		<div className="howToPlayScreen" key="howToPlayScreen">
			<h2 className="howToPlayTitle">How To Play</h2>
			<div className="howToPlayGrid" style={{ opacity: maps ? '1' : '0' }}>
				<div className="howToPlayMapField">
					<img className="howToPlayMap" alt="" src={maps.empty} />
				</div>
				<div className="howToPlayTextField">
					<p>
						The goal of the game is to create a train track path between the entrance and the exit of the
						board.
					</p>
					<p>
						Each row and column must contain the specified amount of tracks in the corresponding header.
						Headers display green if correct and red if overfilled.
					</p>
					<p>Tracks cannot overlap. In order to win the path must be fully connected with no extra tracks.</p>
					<p>
						Default tiles (such as the entrance and exit) cannot be removed from the map. The higher the
						difficulty selected, the less default tiles on the map.
					</p>
				</div>
				<div className="howToPlayMapField">
					<img className="howToPlayMap" alt="" src={maps.complete} />
				</div>
				<div className="howToPlayTextField">
					<p>
						Left clicking places a track. Hovering over different sections of a tile will show what type of
						track will be placed on left click.
					</p>
					<p>
						Right clicking places an X mark. X marks are for labelling tiles where you know there is no
						track.
					</p>
					<p>
						Pressing both mouse buttons at the same time places a dot mark. Dot marks are for labelling
						tiles where you know there is a track but are not sure which type.
					</p>
					<p>Holding down a mouse button and dragging over other tiles will place multiple tracks/markers.</p>
				</div>
			</div>
			<ReturnToMainMenuBtn {...props} />
		</div>
	);
};

export default HowToPlayScreen;
