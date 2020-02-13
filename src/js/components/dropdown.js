import React from 'react';

const DROPDOWN_WIDTH = '7rem';
const DROPDOWN_HEIGHT = '2rem';

class Dropdown extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			defaultValue: 'Dropdown'
		};
	}

	renderDropDownContainer() {
		const containerStyle = {
			width: DROPDOWN_WIDTH,
			height: DROPDOWN_HEIGHT,
			lineHeight: DROPDOWN_HEIGHT,
			backgroundColor: '#eee',
			border: '1px black solid',
			float: 'left',
			webkitUserSelect: 'none',
			mozUserSelect: 'none',
			msUserSelect: 'none',
			userSelect: 'none'
		};
		return <div style={containerStyle}>{this.state.defaultValue} ▼</div>;
	}

	render() {
		return <div>{this.renderDropDownContainer()}</div>;
	}
}

export default Dropdown;
