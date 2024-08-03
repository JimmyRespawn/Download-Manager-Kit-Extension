document.addEventListener('DOMContentLoaded', function() {
    const toggleCheckbox = document.getElementById('toggleDownloadInterceptor');

    chrome.storage.local.get(['downloadInterceptorEnabled'], function(result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            toggleCheckbox.checked = result.downloadInterceptorEnabled || false;
        }
    });

    toggleCheckbox.addEventListener('change', function() {
        const enabled = toggleCheckbox.checked;

        chrome.storage.local.set({ downloadInterceptorEnabled: enabled }, function() {
            console.log("Download interceptor state saved:", enabled);
        });
    });
});

function interceptDownload(downloadItem) {
    console.log("Intercepted download item:", downloadItem);

    let downloadUrl = downloadItem.url;
    console.log("Intercepted download URL:", downloadUrl);

    chrome.downloads.cancel(downloadItem.id, function() {
        console.log("Download cancelled:", downloadUrl);

        let decodedUrl = decodeURIComponent(downloadUrl);
        let customUri = `downloadmanagerkit:?data=DownloadFile-${decodedUrl}`;
     //   chrome.runtime.sendMessage({ action: 'openUri', uri: customUri }, (response) => {
 // console.log('Response:', response);
//});
        chrome.tabs.create({ url: customUri }, function(tab) {
            console.log("Redirected to DMK:", customUri);
        });
    });
}

//chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
 // if (request.action === 'openUri') {
  //  window.location.href = request.uri;
 //   sendResponse({ status: 'success' });
 // }
//});