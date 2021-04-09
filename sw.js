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

self.addEventListener("install", event => {
    // waits until cache is completed and returns the cached assets
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(staticAssets)
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(async (cachedData) => {

            // try fetching new site data and if it is fetched cache it
            try{
                const newFetched = await fetch(event.request);
                if(newFetched.status === 200){
                    const cache = await caches.open(cacheName)
                    await cache.put(event.request, newFetched.clone());
                    return newFetched;
                }
                else{
                    return cachedData;
                }

            }
            // if fetch fails, use cached data
            catch{
                return cachedData;
            }

        })
        
    );

});

