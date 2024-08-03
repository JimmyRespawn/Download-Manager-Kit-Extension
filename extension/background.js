chrome.runtime.onInstalled.addListener(function(details) {
    chrome.storage.local.get(['downloadInterceptorEnabled'], function(result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            if (typeof result.downloadInterceptorEnabled === 'undefined') {
                chrome.storage.local.set({ downloadInterceptorEnabled: false });
            } else if (result.downloadInterceptorEnabled) {
                console.log("Adding download interceptor on install.");
                chrome.downloads.onCreated.addListener(interceptDownload);
            }
        }
    });

    if (details.reason === 'install') {
        chrome.tabs.create({ url: 'popup.html' }, function(tab) {
            console.log("Opened popup for first-time installation.");
        });
    }
});

chrome.runtime.onStartup.addListener(function() {
    chrome.storage.local.get(['downloadInterceptorEnabled'], function(result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else if (result.downloadInterceptorEnabled) {
            console.log("Adding download interceptor on startup.");            			chrome.downloads.onCreated.addListener(interceptDownload);
        }
    });
});

chrome.storage.onChanged.addListener(function(changes, area) {
    if (area === 'local' && changes.downloadInterceptorEnabled) {
        if (changes.downloadInterceptorEnabled.newValue) {
            console.log("Adding download interceptor.");
            chrome.downloads.onCreated.addListener(interceptDownload);
        } else {
            console.log("Removing download interceptor.");
            chrome.downloads.onCreated.removeListener(interceptDownload);
        }
    }
});

function interceptDownload(downloadItem) {
    console.log("Intercepted download item:", downloadItem);

    let downloadUrl = downloadItem.url;
    console.log("Intercepted download URL:", downloadUrl);

    chrome.downloads.cancel(downloadItem.id, function() {
        console.log("Download cancelled:", downloadUrl);

        let decodedUrl = decodeURIComponent(downloadUrl);
        let customUri = `downloadmanagerkit:?data=DownloadFile-${decodedUrl}`;

        //chrome.runtime.sendMessage({ action: 'openUri', uri: customUri }, (response) => {
       //     console.log('Response:', response);
    //    });
        chrome.tabs.create({ url: customUri }, function(tab) {
            console.log("Redirected to DMK:", customUri);
        });
    });
}

//hrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
 // if (request.action === 'openUri') {
  //  window.location.href = request.uri;
 //   sendResponse({ status: 'success' });
 // }
//});