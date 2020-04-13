export const getGameMapContainerStyle = (mapSize, tileRemSize) => {
	return {
		display: 'inline-block',
		position: 'relative',
		zIndex: '0',
		marginBottom: '1rem',
		WebkitUserSelect: 'none',
		MozUserSelect: 'none',
		msUserSelect: 'none',
		userSelect: 'none',
		boxSizing: 'border-box',
		position: 'relative',
		width: `${(mapSize + 1) * tileRemSize}rem`,
		height: `${(mapSize + 1) * tileRemSize}rem`
	};
};
