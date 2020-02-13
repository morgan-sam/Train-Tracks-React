import React from 'react';

const DROPDOWN_WIDTH = '7rem';
const DROPDOWN_HEIGHT = '2rem';
const itemList = [ 'apples', 'berries', 'citrus' ];

class Dropdown extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			defaultValue: 'Dropdown',
			listOpen: false
		};
	}

	setListOpenState(boo) {
		this.setState({
			listOpen: boo
		});
	}

	renderDropDownList() {
		console.log('123');
	}

	renderDropDownContainer() {
		const containerStyle = {
			width: DROPDOWN_WIDTH,
			height: DROPDOWN_HEIGHT,
			lineHeight: DROPDOWN_HEIGHT,
			backgroundColor: '#eee',
			border: '1px black solid',
			WebkitUserSelect: 'none',
			MozUserSelect: 'none',
			msUserSelect: 'none',
			userSelect: 'none'
		};
		let dropDownList = [];
		if (this.state.listOpen) {
			itemList.forEach((el) => {
				dropDownList.push(
					<div style={containerStyle} key={el}>
						{el}
					</div>
				);
			});
		}

		return (
			<div>
				<div style={containerStyle} onClick={() => this.setListOpenState(true)}>
					{this.state.defaultValue} ▼
				</div>
				{dropDownList}
			</div>
		);
	}

	render() {
		const dropDownList = this.renderDropDownList;
		return <div>{this.renderDropDownContainer()}</div>;
	}
}

export default Dropdown;
