import React, { useEffect, useRef, useState } from 'react';

const DROPDOWN_WIDTH = 7;
const DROPDOWN_HEIGHT = 2;
const itemList = [ 'Apples', 'Berries', 'Citrus' ];

const Dropdown = () => {
	const node = useRef();

	const [ listOpen, setListOpen ] = useState(false);

	const [ currentValue, setCurrentValue ] = useState('Dropdown');

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

	const renderDropDownList = () => {
		let dropDownList = [];
		itemList.forEach((item, i) => {
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
				{listOpen ? renderDropDownList() : null}
			</div>
		</div>
	);
};

export default Dropdown;
