import React, { useRef, useState } from 'react';

const DROPDOWN_WIDTH = '7rem';
const DROPDOWN_HEIGHT = '2rem';
const itemList = [ 'Apples', 'Berries', 'Citrus' ];

const Dropdown = () => {
	const node = useRef();

	const [ listOpen, setListOpen ] = useState(false);

	const [ currentValue, setCurrentValue ] = useState('Dropdown');

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

	const listItemStyle = { ...containerStyle, borderTop: 'none' };

	const renderDropDownList = () => {
		let dropDownList = [];
		itemList.forEach((item) => {
			dropDownList.push(
				<div
					style={listItemStyle}
					key={item}
					onClick={() => {
						setCurrentValue(item);
						setListOpen(false);
					}}
				>
					{item}
				</div>
			);
		});
		return dropDownList;
	};

	const renderDropDownContainer = () => {
		let dropDownList = [];
		if (listOpen) {
			dropDownList = renderDropDownList();
		}

		return (
			<div>
				<div style={containerStyle} onClick={() => setListOpen(true)}>
					{`${currentValue} ▼`}
				</div>
				{dropDownList}
			</div>
		);
	};

	return <div>{renderDropDownContainer()}</div>;
};

export default Dropdown;
