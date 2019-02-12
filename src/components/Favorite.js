import React, {Component} from 'react'
import axios from 'axios';
import { Route, Switch, Link } from 'react-router-dom';
import Main from './Main';

const apiKey = "8aa27dc6b9e28772922e2b6bb363e3d2";


class Favorite extends Component{
    constructor(props) {
        super(props);
        this.state = {
            info: []
        }
    }

    componentWillMount (){
        console.log("Here is starting point of didmount");
            if(this.props.fav !== " "){
                var data = [];
                var city = this.props.fav;
                const url = "http://api.openweathermap.org/data/2.5/forecast?id="+city+"&APPID="+apiKey+"&units=metric";
                axios.get(url)
                .then(function(res){
                    console.log("Here is request responding area ");
                    data.push(res.data.city.name);
                    data.push(res.data.list[0].main.temp)
                })
                .catch(err=>{
                    console.log(err)
                })
                this.setState({info: data});
                console.log("Here is for the info data ", this.state.info);
            }
    }

    render(){
        return(
            <div>
                {/* <Switch>
                    <Route path="/" exact component={Main}/>
                </Switch>
                <Link to={{pathname:'/', state:{id: ""}}}>Back to main</Link> */}

                {this.state.info.length > 0 ? this.state.info.map(list => (
                    <div>
                        <div id="city">City:{list} </div>
                        <div className="row justify-content-center">
                            <div id="temp" className="col">
                            Temprature: {list}
                            </div>
                        </div>
                    </div>
                )): <div></div>}
                
                        {/* Click Here to check as favorite
                    <button onClick={this.checkBox}>Bookmark</button> */}
            </div>
        )
    }
}

export default Favorite