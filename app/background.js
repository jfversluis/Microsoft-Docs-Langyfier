'use strict';

chrome.runtime.onInstalled.addListener(function () {
    localStorage["enableExtension"] = "true";

    chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
        if (localStorage["enableExtension"] != "true")
            return;

        if (localStorage["unwantedLanguage"] === "" || localStorage["preferedLanguage"] === ""
            || localStorage["unwantedLanguage"] === undefined || localStorage["preferedLanguage"] === undefined) {
            return;
        }

        if (details.url.indexOf("docs.microsoft.com") != -1)
        {
            if (details.url.indexOf(localStorage["unwantedLanguage"]) != -1)
            {
                chrome.tabs.update(details.tabId, {
                    url: details.url.replace(new RegExp(localStorage["unwantedLanguage"], "gi"), localStorage["preferedLanguage"]) });
            }
        }       
    })
});

chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'docs.microsoft.com' },
        })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
});