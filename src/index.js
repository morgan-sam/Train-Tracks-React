import React from 'react';
import ReactDOM from 'react-dom';
import seedrandom from 'seedrandom';
import App from './js/components/app';
import './css/index.css';

const seed = Math.random();
console.log(seed);
seedrandom(seed, { global: true });
ReactDOM.render(<App />, document.getElementById('root'));
