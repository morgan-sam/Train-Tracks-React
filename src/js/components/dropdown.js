import React, { useEffect, useRef, useState } from 'react';

const Dropdown = ({ style, placeholder, options }) => {
	const [ listOpen, setListOpen ] = useState(false);
	const [ currentValue, setCurrentValue ] = useState(placeholder);

	const containerStyle = {
		backgroundColor: '#eee',
		border: '1px black solid',
		lineHeight: style.height,
		...style,
		position: 'relative',
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

	const renderDropdownArrow = () => {
		const arrowStyling = { fontSize: '0.75rem', position: 'absolute', right: '7.5%' };
		return <span style={arrowStyling}>▼</span>;
	};

	useEffect(() => {
		if (listOpen) {
			document.addEventListener('mousedown', whileDropdownOpenClick);
		} else {
			document.removeEventListener('mousedown', whileDropdownOpenClick);
		}
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
				{currentValue}
				{renderDropdownArrow()}
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
