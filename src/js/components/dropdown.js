import React, { useEffect, useRef, useState } from 'react';

const DROPDOWN_WIDTH = 7;
const DROPDOWN_HEIGHT = 2;
const itemList = [ 'Apples', 'Berries', 'Citrus' ];

const Dropdown = ({ placeholder, options }) => {
	const [ listOpen, setListOpen ] = useState(false);

	const [ currentValue, setCurrentValue ] = useState(placeholder);

	const containerStyle = {
		position: 'relative',
		width: `${DROPDOWN_WIDTH}rem`,
		height: `${DROPDOWN_HEIGHT}rem`,
		lineHeight: `${DROPDOWN_HEIGHT}rem`,
		backgroundColor: '#eee',
		border: '1px black solid',
		WebkitUserSelect: 'none',
		MozUserSelect: 'none',
		msUserSelect: 'none',
		userSelect: 'none'
	};

	const listItemStyle = {
		...containerStyle,
		borderTop: 'none'
	};

	const renderDropDownList = (options) => {
		let dropDownList = [];
		options.forEach((item, i) => {
			dropDownList.push(
				<div
					className={'dropdown'}
					style={{ ...listItemStyle }}
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

	useEffect(() => {
		if (listOpen) document.addEventListener('mousedown', whileDropdownOpenClick);
		return () => document.removeEventListener('mousedown', whileDropdownOpenClick);
	});

	const whileDropdownOpenClick = (e) => {
		if (e.target.className === 'dropdown') {
			return;
		}
		setListOpen(false);
	};

	return (
		<div>
			<div className={'dropdown'} style={containerStyle} onClick={() => setListOpen(!listOpen)}>
				{`${currentValue} ▼`}
			</div>
			<div
				style={{
					position: 'absolute'
				}}
			>
				{listOpen ? renderDropDownList(options) : null}
			</div>
		</div>
	);
};

export default Dropdown;
