console.log("Hello from sw.js");

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
    workbox.routing.registerRoute(
        new RegExp('.*\.js'),
        workbox.strategies.networkFirst()
        // workbox.strategies.cacheFirst()
    );

    workbox.routing.registerRoute(
        new RegExp('.*\.css'),
        // workbox.strategies.cacheFirst()
        workbox.strategies.networkFirst()
    );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}


