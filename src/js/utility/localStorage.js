import { isNonEmptyArray } from 'js/utility/utilityFunctions';

export const saveMapToLocal = async (mapToSave) => {
	let localMaps = JSON.parse(window.localStorage.getItem('savedMaps'));
	if (isNonEmptyArray(localMaps)) {
		const newMapArray = [ ...localMaps, mapToSave ];
		await window.localStorage.setItem('savedMaps', JSON.stringify(newMapArray));
	} else {
		await window.localStorage.setItem('savedMaps', JSON.stringify([ mapToSave ]));
	}
};

export const getLocalStorageMaps = () => {
	let localMaps = JSON.parse(window.localStorage.getItem('savedMaps'));
	if (!isNonEmptyArray(localMaps)) localMaps = [];
	return localMaps;
};

export const deleteLocalSavedMap = async (deleteMapSeed) => {
	const localMaps = getLocalStorageMaps();
	const newMapArray = localMaps.filter((el) => el.seed !== deleteMapSeed);
	await window.localStorage.setItem('savedMaps', JSON.stringify(newMapArray));
};

export const deleteAllLocalSavedMaps = async () => {
	await window.localStorage.setItem('savedMaps', JSON.stringify([]));
};
