// guide
// https://www.youtube.com/watch?v=E8BeSSdIUW4&ab_channel=vaadinofficial

const cacheName = "snakeOfflineData";
const staticAssets = [
    "./", 

    "./src/css/styles.css",

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

self.addEventListener("install", async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting()
});

self.addEventListener("activate", e => {
    self.clients.claim();
});

self.addEventListener("fetch", async e => {
    const req = e.request;
    const url = new URL(req.url);

    e.respondWith(networkAndCache(req));
});

async function networkAndCache(req){
    const cache = await caches.open(cacheName);
    try{
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    }
    catch(e){
        const cached = await cache.match(req);
        return cached;
    }
}
