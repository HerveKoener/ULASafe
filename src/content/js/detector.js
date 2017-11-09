var publicKeyRegex = /(G[A-Z|0-9]{55})/mgi;

browserApi.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if(message.type === 'findPubKeys') {
           sendResponse(new Set(document.querySelector("body").textContent.match(publicKeyRegex)));
        }
    }
);