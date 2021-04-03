const cacheName = "snakeOfflineData";
const staticAssets = [
    "../../index.html", 

    "../css/styles.css",

    "./manifest.json",

    "./src/js/Game.js",
    "./src/js/Snake.js",
    "./src/js/Food.js",
    "./src/js/BonusFood.js",
    "./src/js/Sound.js",
    "./src/js/Storage.js",

    "./src/icons/icon-192x192.png",
    "./src/icons/icon-512x512.png",

    "./src/sounds/bonusFoodEatSound.wav",
    "./src/sounds/bonusFoodSpawnSound.wav",
    "./src/sounds/deathSound.wav",
    "./src/sounds/eatSound.wav",
    "./src/sounds/highScoreSound.wav",
    "./src/sounds/menuEffectSound.wav",
    "./src/sounds/startGameSound.wav"
]



self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(staticAssets);
        })
    );
});


self.addEventListener("fetch", e => {

    e.respondWith(
        caches.match(e.request).then(async (response) => {

            // fetch(e.request).then((res) => {
            //     console.log("game files fetched");
            //     return res || response;
            // }).catch(err => {
            //     console.log("no network using cached");
            //     console.log(err)
            //     return response;
            // });
            
            try{
                const a = await fetch(e.request);
                return a
            }
            catch{
                return response;
            }
            


            
            

        })
        
    );

});





// self.addEventListener("install", async e => {
//     const cache = await caches.open(cacheName);
//     await cache.addAll(staticAssets);
//     const a = await self.skipWaiting();
//     return a
// });

// self.addEventListener("activate", e => {
//     self.clients.claim();
// });

// self.addEventListener("fetch", async e => {
//     const req = e.request;
//     const url = new URL(req.url);

//     e.respondWith(networkAndCache(req));
// });

// async function networkAndCache(req){
//     const cache = await caches.open(cacheName);
//     try{
//         const fresh = await fetch(req);
//         await cache.put(req, fresh.clone());
//         return fresh;
//     }
//     catch(e){
//         const cached = await cache.match(req);
//         return cached;
//     }
// }

