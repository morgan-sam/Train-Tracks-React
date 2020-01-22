import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return <div className="box" />;
}

class App extends React.Component {
	render() {
		return (
			<div>
				<h1>Train Tracks</h1>
				{Square()}
				{Square()}
				{Square()}
				{Square()}
				{Square()}
				{Square()}
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
