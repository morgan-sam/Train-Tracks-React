import React from 'react';
import WaveButton from '../components/waveButton';

import { deleteLocalSavedMap, deleteAllLocalSavedMaps } from '../utility/localStorage';

export const DeleteMapConfirmScreen = (props) => {
	return (
		<div className="deleteConfirmScreen">
			<h3 className="deleteConfirmLabel">
				Are you sure you want to delete {props.deleteModeOnAll ? 'ALL saved maps?' : 'the following saved map?'}
			</h3>
			<img
				alt=""
				src={props.deleteModeOnAll ? null : props.mapIcon}
				style={{ display: props.deleteModeOnAll ? 'none' : 'block' }}
				className="confirmDeleteIcon"
			/>
			<div className="deleteButtons">
				<WaveButton
					className="confirmDeleteBtn"
					key={'confirmDeleteBtn'}
					onClick={() => {
						console.log(props);
						if (props.deleteModeOnAll) deleteAllLocalSavedMaps();
						else deleteLocalSavedMap(props.gameState.seed);
						props.quitToLoadScreen();
					}}
					text={'Confirm'}
				/>
				<WaveButton
					className="cancelDeleteBtn"
					key={'cancelDeleteBtn'}
					onClick={() => {
						props.quitToLoadScreen();
					}}
					text={'Cancel'}
				/>
			</div>
		</div>
	);
};

export default DeleteMapConfirmScreen;
