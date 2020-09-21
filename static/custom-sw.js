// THIS FILE SHOULD NOT BE VERSION CONTROLLED

// https://github.com/NekR/self-destroying-sw

//self.addEventListener('install', function (e) {
//  self.skipWaiting()
//})

//self.addEventListener('activate', function (e) {
//    self.registration.unregister()
//        .then(function () {
//            return self.clients.matchAll()
//        })
//        .then(function (clients) {
//            clients.forEach(client => client.navigate(client.url))
//        })
//})


// Должно быть true в production
var doCache = true;

// Имя кэша
var CACHE_NAME = 'keep-app-cache';

// Очищает старый кэш
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(keyList =>
                Promise.all(keyList.map(key => {
                    if (!cacheWhitelist.includes(key)) {
                        console.log('Deleting cache: ' + key)
                        return caches.delete(key);
                    }
                }))
            )
    );
});

// 'install' вызывается, как только пользователь впервые открывает PWA
self.addEventListener('install', function(event) {
    if (doCache) {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function(cache) {
                    // Получаем данные из манифеста (они кэшируются)
                    fetch('/manifest.json')
                        .then(response => {
                            response.json()
                        })
                        .then(assets => {
                            // Открываем и кэшируем нужные страницы и файлы
                            const urlsToCache = [
                                '/active',
                                '/blog',
                                '/blog/*',
                                '/info',
                                '/setting',
                                '/img/*.*',
                                '/*.*',
                            ]
                            cache.addAll(urlsToCache)
                            console.log('cached');
                        })
                })
        );
    }
});

// Когда приложение запущено, сервис-воркер перехватывает запросы и отвечает на них данными из кэша, если они есть
self.addEventListener('fetch', function(event) {
    if (doCache) {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
        );
    }
});
