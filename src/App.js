import React, { Component } from 'react';
import Detail from './components/Detail';
import Main from './components/Main';
import { Route, Switch, Redirect } from 'react-router-dom';

class App extends Component {
  // render() {
  //   return (
  //     <div className="App">
  //       <header className="App-header">
  //         <img src={logo} className="App-logo" alt="logo" />
  //         <p>
  //           Edit <code>src/App.js</code> and save to reload.
  //         </p>
  //         <a
  //           className="App-link"
  //           href="https://reactjs.org"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           Learn React
  //         </a>
  //       </header>
  //     </div>
  //   );
  // }

  render(){
    return(
        <div>
            <h1>Weather App</h1>
            <Switch>
                <Route path="/detail" exact component={Detail}/>
                <Route path="/" exact component={Main}/>
                <Redirect to="/"/>
            </Switch>

        </div>
    )
}
}

export default App;
