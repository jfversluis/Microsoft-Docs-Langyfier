'use strict';

// Wire up things for when Chrome is started
chrome.runtime.onStartup.addListener(function () {
    init();
});

// Wire up things when extension is first installed
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({'enableExtension': "true"});

    init();

    let matchRule = {
        conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'learn.microsoft.com' }
        })
      ],
      actions: [ new chrome.declarativeContent.ShowAction() ]
    };

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([matchRule]);
    });

    chrome.tabs.create({
        url: chrome.runtime.getURL('app/settings.html?firstTime=true')
    });
});

let enableExtension = false;
let unwantedLanguage = "";
let preferredLanguage = "";

function init() {
    chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
        if (details.url.indexOf("learn.microsoft.com") == -1)
            return;

        chrome.storage.sync.get('enableExtension', (data) => {
            enableExtension = data.enableExtension;

            chrome.storage.sync.get('unwantedLanguage', (data) => {
                unwantedLanguage = data.unwantedLanguage;

                chrome.storage.sync.get('preferredLanguage', (data) => {
                    preferredLanguage = data.preferredLanguage;

                    if (!enableExtension)
                    return;
        
                    if (unwantedLanguage === "" || preferredLanguage === ""
                        || unwantedLanguage === undefined || preferredLanguage === undefined) {
                        return;
                    }
            
                    if (details.url.indexOf(unwantedLanguage) > -1) {
                        chrome.tabs.update(details.tabId, {
                            url: details.url.replace(new RegExp(unwantedLanguage, "gi"), preferredLanguage)
                        });
                    }
                });
            });
        });
    })
}