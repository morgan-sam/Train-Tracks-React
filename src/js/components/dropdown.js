import React, { useEffect, useState } from 'react';

const Dropdown = ({ style, placeholder, options, onChange, onHover, className }) => {
	const [ listOpen, setListOpen ] = useState(false);
	const [ defaultValue, setDefaultValue ] = useState(placeholder);
	const [ hoveredOption, setHoveredOption ] = useState(null);

	const boxBackground = 'linear-gradient(#fcfcfc, #ddd)';

	const containerStyle = {
		background: boxBackground,
		border: '1px #aaa solid',
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
					style={{
						...listItemStyle,
						background: hoveredOption === i ? '#9999FF' : '#f3f3f3',
						color: hoveredOption === i ? 'white' : 'black'
					}}
					key={`dropdownOption${i}`}
					onClick={() => {
						optionSelected(item.value, item.mapObject);
						setDefaultValue(item.display);
					}}
					onMouseOver={() => {
						optionHovered(item.mapObject);
						setHoveredOption(i);
					}}
					onMouseLeave={() => {
						optionHovered(null);
						setHoveredOption(null);
					}}
					onContextMenu={(e) => e.preventDefault()}
				>
					{item.display}
				</div>
			);
		});
		return dropDownList;
	};

	const renderDropdownArrow = () => {
		const arrowStyling = { fontSize: '0.75rem', position: 'absolute', right: '5%' };
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
		onHover(false);
	};

	const optionSelected = (item, mapObject) => {
		onChange(item, mapObject);
		setListOpen(false);
	};

	const optionHovered = (item) => {
		onHover(item);
	};

	return (
		<div className={className}>
			<div
				className={'dropdown'}
				style={{ ...containerStyle, backgroundColor: listOpen ? '#ccc' : '#eee' }}
				onMouseDown={(e) => {
					if (e.buttons === 1) setListOpen(!listOpen);
				}}
				onContextMenu={(e) => e.preventDefault()}
			>
				{defaultValue}
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
