import React, { useEffect, useState } from 'react';

const Dropdown = ({ style, placeholder, options, onChange, onHover, className }) => {
	const [ listOpen, setListOpen ] = useState(false);
	const [ defaultValue, setDefaultValue ] = useState(placeholder);
	const [ hoveredOption, setHoveredOption ] = useState(null);

	const containerStyle = {
		background: '#fff',
		border: '1px #aaa solid',
		lineHeight: style.height,
		...style,
		position: 'relative',
		WebkitUserSelect: 'none',
		MozUserSelect: 'none',
		msUserSelect: 'none',
		userSelect: 'none',
		borderRadius: listOpen ? '1rem 1rem 0 0' : '1rem',
		boxShadow: '0px 5px 0px 2px #eee',
		cursor: 'pointer'
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
						background: hoveredOption === i ? '#9999FF' : '#fff',
						color: hoveredOption === i ? 'white' : 'black',
						borderRadius: i === options.length - 1 ? '0 0 1rem 1rem' : '0'
					}}
					key={`dropdownOption${i}`}
					onClick={() => {
						optionSelected(item);
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

	const optionHovered = (item) => onHover(item);

	return (
		<div className={className}>
			<div
				className={'dropdown'}
				style={{ ...containerStyle, backgroundColor: '#fff' }}
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
