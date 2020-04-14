import { compareArrays } from '../utility/utilityFunctions';

export const getCombinedArrayOfNewAndOldTiles = (newTiles, map) => {
	const tilesToPlace = filterNewTilesOfDefaultTiles(newTiles, map.mapTracks);
	const alreadyPlacedTiles = filterAlreadyPlacedTracksOfNewTiles(tilesToPlace, map.placedTracks);
	return [ ...tilesToPlace, ...alreadyPlacedTiles ];
};

const filterNewTilesOfDefaultTiles = (newTiles, mapTracks) => {
	const filteredTiles = newTiles.filter((newTile) => {
		const defaultOverlapTiles = mapTracks.filter(
			(mapTile) => compareArrays(newTile.tile, mapTile.tile) && mapTile.defaultTrack
		);
		return defaultOverlapTiles.length === 0;
	});
	return filteredTiles;
};

const filterAlreadyPlacedTracksOfNewTiles = (newTiles, placedTracks) => {
	let nonConflictingPlacedTracks = [];
	placedTracks.forEach(function(track) {
		let placedTrackConflict = false;
		newTiles.forEach(function(el) {
			if (compareArrays(track.tile, el.tile)) placedTrackConflict = true;
		});
		if (!placedTrackConflict) nonConflictingPlacedTracks.push(track);
	});
	return nonConflictingPlacedTracks;
};
