
async function listOfflinePages() {
if (document.getElementById('offlinePageList')) {
    // kudos https://remysharp.com/2019/09/05/offline-listings 
    var visitedPagesOutput = '';
    for (const name of await caches.keys()) {
        if (name.includes('pages')) {
            const cache = await caches.open(name);
            for (const request of await cache.keys()) {
                visitedPagesOutput += '<li><a href="' + request.url + '">' + request.url + '</a></li>';
            }
        }
    }
    document.getElementById('offlinePageList').innerHTML = visitedPagesOutput;
}
}
listOfflinePages();