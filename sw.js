// service worker for making the game installable

const cacheName = "snakeOfflineData";
const staticAssets = [
    // html
    "./", 

    // css
    "./src/css/styles.css",

    // js files
    "./src/js/Game.js",
    "./src/js/Snake.js",
    "./src/js/Food.js",
    "./src/js/BonusFood.js",
    "./src/js/Sound.js",
    "./src/js/Storage.js",

    // images
    "./src/icons/icon-192x192.png",
    "./src/icons/icon-512x512.png",

    // sound
    "./src/sounds/bonusFoodEatSound.wav",
    "./src/sounds/bonusFoodSpawnSound.wav",
    "./src/sounds/deathSound.wav",
    "./src/sounds/eatSound.wav",
    "./src/sounds/highScoreSound.wav",
    "./src/sounds/menuEffectSound.wav",
    "./src/sounds/startGameSound.wav",

    // other
    "./manifest.json"
]


self.addEventListener("install", e => {
    const cache = cacheAssets(e);
    return cache;
});

// self.addEventListener("fetch", e => {
//     e.respondWith(
//         caches.match(e.request).then(async (cachedData) => {

//             // try fetching new site data and if it is fetched cache it
//             try{
//                 const newFetched = await fetch(e.request);
//                 cacheAssets(e);
//                 return newFetched;
//             }
//             // if fetch fails, use cached data
//             catch{
//                 return cachedData;
//             }

//         })
        
//     );

// });



self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request)
    .then(cachedData => {
        return fetch(e.request)
        .then(resp => {
            return caches.open(cacheName)
            .then(cache => {
                cache.put(e.request, resp.clone());
                return resp;
        })
        }).catch(err => {
            return cachedData;
        })
    }));
  });







function cacheAssets(e){
    // waits until cache is completed and returns the cached assets
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(staticAssets);
        })
    );
}



