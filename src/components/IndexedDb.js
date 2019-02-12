
export default class IndexedDb {
    
    initDb(){
        if (!window.indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
            return false;
        }else{
            var db;
            var request = window.indexedDB.open("weatherData", 1);
            
            request.onerror = function(event) {
                console.log("Database init failed");
                alert("Database init failed");
                return false;
            };
            
            request.onsuccess = function(event) {
                db = request.result;
                console.log("successfully db init");
                return true;
            };
            
            request.onupgradeneeded = function(event) {
                var db = event.target.result;
                db.createObjectStore("weatherData", { keyPath: 'id' }/*{ autoIncrement: true }**/);
                return true;
            }
        }
    }

    read(id) {
        var db;
        var request = window.indexedDB.open("weatherData", 1);

        request.onsuccess = function(event) {
            db = request.result;
            var transaction = db.transaction(['weatherData']);
            var objectStore = transaction.objectStore('weatherData');
            var dbRequest = objectStore.get(id);
    
            dbRequest.onerror = function(e) {
                console.log('Transaction failed');
                return false
            };
    
            dbRequest.onsuccess = function(e) {
                if (dbRequest.result) {
                    return dbRequest.result
                } else {
                    console.log('No data record');
                    return false
                }
            };
        };
    }

    readAll() {
        var db;
        var request = window.indexedDB.open("weatherData", 1);
        
        request.onsuccess = function(event) {
            db = request.result;
            var objectStore = db.transaction("weatherData").objectStore("weatherData");
        
            objectStore.openCursor().onsuccess = function(event) {
               var cursor = event.target.result;           
               if (cursor) {
                alert("successfully read");
                console.log(cursor);
                cursor.continue();
               } else {
                  alert("No more entries!");
                  console.log("no more entries")
               }
            };
        };
    }

    add(id, data, time) {
    
    var db;
    var request = window.indexedDB.open("weatherData", 1);
    
    request.onsuccess = function(event) {
        db = request.result;
        var dbRequest = db.transaction(["weatherData"], "readwrite")
        .objectStore("weatherData")
        .add({id: id, data: data, reqTime:time });
        
        dbRequest.onsuccess = function(e) {
            console.log("Data has been added to your database.");
            return true;
        };
        
        dbRequest.onerror = function(e) {
            return false;
        }
    };

    }
    remove() {
    var request = db.transaction(["weatherData"], "readwrite")
    .objectStore("weatherData")
    .delete(1);
    
    request.onsuccess = function(e) {
        alert("Successfully deleted");
        console.log("Successfully deleted");
    };
    }

    update(id, data, time){
        var db;
        var request = window.indexedDB.open("weatherData", 1);
            
        request.onsuccess = function(e) {
            db = request.result;
            var dbRequest = db.transaction(['weatherData'], 'readwrite')
            .objectStore('weatherData')
            .put({id: id, data: data, reqTime: time});
        
            dbRequest.onsuccess = function (e) {
                console.log('The data has been updated successfully');
            };
            
            dbRequest.onerror = function (e) {
                console.log('The data has been updated failed');
            }

        };

    }


}//End of class