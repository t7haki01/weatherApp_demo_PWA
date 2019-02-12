import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Route } from 'react-router-dom';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

// ReactDOM.render(<App />, document.getElementById('root'));

const reactTarget = document.getElementById('react-target');

ReactDOM.render((
    <BrowserRouter>
         <Route path="/" component={App}/>
    </BrowserRouter>
    ), reactTarget);
