import cityList from "../city.list.json";

var cityData = [];
for(var i = 0; i<cityList.length; i++){
    cityData.push(cityList[i]["name"]);
}


function autoSearch(){
    var maxNum = 0;
    for(var i = 0; i < cityData.length; i++){
        if(cityData[i].slice(0, /*e.target.value.length**/).toUpperCase() === /**e.target.value */.toUpperCase() && maxNum < 15){
            var option = document.createElement('option');
            option.value = cityData[i];
            option.text = cityData[i];
            /**dataList.appendChild(option); */
            maxNum ++;
        }
    }
}
