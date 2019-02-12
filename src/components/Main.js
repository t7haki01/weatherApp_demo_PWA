import React, {Component} from 'react';
import axios from 'axios';
import cityList from '../city.list.json';
import Detail from './Detail';
import { Route, Switch, Link } from 'react-router-dom';
import IndexedDb from './IndexedDb';
// import Worker from ".Worker"
import Autocomplete from 'react-autocomplete';

const apiKey = "e7c2d7e0bc57d08250f0b63cde630511";

var cityData = [];
for(var i = 0; i<cityList.length; i++){
    cityData.push(cityList[i]["name"]);
}
var curMon = new Date().getMonth() + 1 ;
var curTime = new Date().getHours() + ":" + new Date().getMinutes() + ", " + new Date().getDate() + "-" + curMon + "-" + new Date().getFullYear()

var autoItem = []
// for(var i = 0; i<15; i++){
//     autoItem[i] = { 
//                     id: cityList[i]["name"],
//                     label: cityList[i]["name"]
//                   }
// }
const offlineDb = new IndexedDb();

class Main extends Component{
    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            city: '',
            id: '',
            fav: [],
            value: '',
            offlineData: []
        };
      }

      bookmarkCheck() {

          if(localStorage.getItem("city")!==null){
            var citiesInString = localStorage.getItem("city");
            var citiesInArray = citiesInString.split(" ");
            var filteredArray = [];
            for(var i = 0; i<citiesInArray.length;i++){
                if(citiesInArray[i] !== " " && citiesInArray[i] !== ""){
                    filteredArray.push(parseInt(citiesInArray[i]));
                }
            }
            citiesInArray = filteredArray ;
            var multiCity = "";
            for(var j = 0; j<citiesInArray.length; j++){
                multiCity += citiesInArray[j] + ","
            }
            multiCity = multiCity.substring(0, multiCity.length-1);

            if(citiesInArray.length>0){
                if(navigator.onLine){
                    var url = "https://api.openweathermap.org/data/2.5/group?id="+multiCity+"&APPID="+apiKey+"&units=metric";
                    axios.get(url)
                    .then( res => {
                        const fav = res.data.list;
                        for(var l=0; l<res.data.list.length; l++){
                            fav[l].reqTime = curTime;
                        }

                        this.setState({ fav });
                        console.log("From here fav ", fav);
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                }
                else{
                    var db;
                    var request = window.indexedDB.open("weatherData", 1);

                    request.onsuccess = function(event) {
                        var resultAry = [];
                            db = request.result;
                            var transaction = db.transaction(['weatherData']);
                            var objectStore = transaction.objectStore('weatherData');
                            var dbRequest = objectStore.getAll();
                    
                            dbRequest.onerror = function(e) {
                                console.log('Transaction failed');
                            };
                    
                            dbRequest.onsuccess = function(e) {
                                if (dbRequest.result) {
                                    for(var k=0; k<dbRequest.result.length; k++){
                                        if(citiesInArray.indexOf(dbRequest.result[k].id) !== -1){
                                            resultAry.push(
                                                {
                                                    id: dbRequest.result[k].id, 
                                                    name: dbRequest.result[k].data.city.name, 
                                                    sys:{country: dbRequest.result[k].data.city.country},
                                                    main:{temp: dbRequest.result[k].data.list[0].main.temp},
                                                    reqTime: dbRequest.result[k].reqTime
                                                }
                                            )   
                                        }
                                    }
                                    const fav = resultAry;
                                    this.setState({fav});
                                } else {
                                    console.log('No data record');
                                    return false;
                                }
                            }.bind(this);
                    }.bind(this);

                }
              }
          }
      }

    async getData (){
            var isThere = false;
            var filtered = "none";
    
            for(var i = 0; i<cityList.length; i++){
                if(cityList[i]["name"].toUpperCase()===this.state.city.toUpperCase()){
                    this.setState({id: cityList[i]["id"]});
                    filtered = cityList[i]["id"];
                    isThere = true;
                    break;
                }
            }
            
            if(isThere && filtered !== "none"){
                var url = "https://api.openweathermap.org/data/2.5/forecast?id="+filtered+"&APPID="+apiKey+"&units=metric";
                if(navigator.onLine){
                    axios.get(url)
                    .then(function(res){
                        console.log(res.data);
                        document.getElementById("result").innerHTML = " ";                    
                        var btn = document.createElement('button');
                        btn.id = "btn";
                        btn.className ="btn btn-success";

                        var div1 = document.createElement('div');
                        div1.innerText = res.data["city"]["name"] + ", " + res.data["city"]["country"];

                        var div2 = document.createElement('div');
                        div2.innerText = "Temperature: " + res.data["list"][0]["main"]["temp"];

                        var div3 = document.createElement('div');
                        div3.innerText = "Request Time: " + curTime;

                        btn.appendChild(div1);
                        btn.appendChild(div2);
                        btn.appendChild(div3);

                        document.getElementById("result").appendChild(btn);

                        document.getElementById("resultLink").style.display = "block";


                        //From here, for the offline, indexedDB is applied 
                        //and for updating more latest weather info, it is 
                        //not able to compare timestamp immediately from indexeddb and new data because it is not
                        //asynchronous, for this it is good to use some libraries but this time i want to learn more about
                        //indexedDB vanilla and it is also make sense that my algorithm makes update for later request so that it would be 
                        //most latest weather info in indexedDb without checking it
                        if(offlineDb.initDb());{
                            if(offlineDb.add(res.data.city.id, res.data, curTime)){
                                console.log("Successfully added")
                            }
                            else{                      
                                offlineDb.update(res.data.city.id, res.data, curTime);
                            }
                        }
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                }
                else{
                    /**From here for the offline situation */
                    var db;
                    var request = window.indexedDB.open("weatherData", 1);

                    request.onsuccess = function(e) {
                        db = request.result;
                        var transaction = db.transaction(['weatherData']);
                        var objectStore = transaction.objectStore('weatherData');
                        var dbRequest = objectStore.get(filtered);
                
                        dbRequest.onerror = function(e) {
                            console.log('Transaction failed');
                        };
                
                        dbRequest.onsuccess = function(e) {
                            if (dbRequest.result) {
                                var res = dbRequest.result
                                document.getElementById("result").innerHTML = " ";                    
                                var btn = document.createElement('button');
                                btn.id = "btn";
                                btn.className ="btn btn-success";
            
                                var div1 = document.createElement('div');
                                div1.innerText = res.data["city"]["name"] + ", " + res.data["city"]["country"];
            
                                var div2 = document.createElement('div');
                                div2.innerText = "Temperature: " + res.data["list"][0]["main"]["temp"];

                                var div3 = document.createElement('div');
                                div3.innerText = "Requested Time: " + res.reqTime;
            
                                btn.appendChild(div1);
                                btn.appendChild(div2);
                                btn.appendChild(div3);
            
                                document.getElementById("result").appendChild(btn);
            
                                document.getElementById("resultLink").style.display = "block";
                            } else {
                                console.log('No data record ');
                                document.getElementById("result").innerHTML = "Now current app is offline mode and " + this.state.city
                                + " is not searched while online so it is not saved within app, try it later when it is online.";
                                return false
                            }
                        }.bind(this);
                    }.bind(this);
                }
            }
            else{
                document.getElementById("result").innerHTML = "There is no city with that name as " + this.state.city + " in this app city data";
            }
            
    }


    componentDidMount(){
            this.bookmarkCheck();
    }

    onChange (e) {

        // var worker = new Worker('Worker.js')

        var dataList = document.getElementById("listOfCity");
        while(dataList.firstChild){
            dataList.removeChild(dataList.firstChild);
        }
        const state = this.state;
        state[e.target.name] = e.target.value;

        if(e.target.value.length > 1){
            var maxNum = 0;
            for(var i = 0; i < cityData.length; i++){
                if(cityData[i].slice(0, e.target.value.length).toUpperCase() === e.target.value.toUpperCase() && maxNum < 15){
                    var option = document.createElement('option');
                    option.value = cityData[i];
                    option.text = cityData[i];
                    dataList.appendChild(option);
                    maxNum ++;
                }
            }
        }
        this.setState(state);
    };


    render(){
        return(
            <div className="mainDiv">
                <div className="row justify-content-center">
                {/* From here was used for deploying in android view because datalist is not supported yet */}
                        {/* <Autocomplete
                            items={autoItem}
                            shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                            getItemValue={item => item.label}
                            renderItem={(item, highlighted) =>
                                    <div
                                        name="options"
                                        key={item.id}
                                        style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
                                    >
                                    {item.label}
                                    </div>
                            }
                            value={this.state.value}
                            onChange={this.onChange}
                            onSelect={value => this.setState({ value })}
                        />
                        <button onClick={this.getData} className="btn btn-primary">Search</button> */}
                </div>

{/* From here, used datalist because it is little more faster and supported in browsers             */}

                <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <button onClick={this.getData} className="btn btn-outline-primary" type="button">Search</button>                
                </div>
                    <input aria-describedby="city to search weather info" aria-label="city" placeholder="City name to search weather information" type="search" className="form-control" list="listOfCity" name="city" id="city" onChange={this.onChange} autoComplete="off"></input>
                    <datalist id="listOfCity"></datalist>
                </div>
                <Switch>
                    <Route path="/detail" exact component={Detail}/>
                </Switch>
                
                <Link to={{pathname:'/detail', state:{id: this.state.id}}}>
                <div className="row justify-content-center">
                    <div title="Click Here to check detail" id="resultLink">
                        <div id="result"></div>
                    </div>
                </div></Link>


                <br/>
                <hr/>
                <div className="row justify-content-center">
                    <h2><span className="badge badge-warning">BookMarked City</span></h2>
                </div>
                <div className="row justify-content-center">
                    {this.state.fav.length > 0 ? this.state.fav.map(list => (
                        <div className="favMarks">
                            <div className="row justify-content-center" title="Click Here to check detail">
                                <div className="col-3">
                                    <Link to={{pathname:'/detail', state:{id: list.id}}}><div  id={list.id}>
                                    <button className="btn btn-info" id="btn">{console.log(this.state.fav)}
                                            <div><b>{list.name},  {list.sys.country}</b></div>
                                            <div>Temperature: {list.main.temp}</div>
                                            <div>Request Time: {list.reqTime}</div>
                                    </button>
                                    </div></Link><br/>
                                </div>
                            </div>
                        </div>
                    )):<div></div>}
                </div>
            </div>
        )
    }
}

export default Main
