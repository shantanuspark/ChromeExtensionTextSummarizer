var contextMenuItem = {
    "id": "summarize",
    "title": "Summarize",
    "contexts": ["selection"]
};

chrome.storage.sync.set({ 'summaryIn': 'window', 'summaryOf': 'text', 'tts': true });

chrome.contextMenus.create(contextMenuItem);

//When the context menu option is clicked
chrome.contextMenus.onClicked.addListener(function (clickData) {

    //Get user preferences from local storage 
    chrome.storage.sync.get(['summaryIn', 'summaryOf', 'tts'], function (preferences) {
        var summaryIn = preferences.summaryIn;
        var summaryOf = preferences.summaryOf;
        var tts = preferences.tts;

        if (clickData.menuItemId == "summarize") {
            var summary;
            //when user preference is to get summary of whole page
            if (preferences.summaryOf == 'page') {
                //get current tab id
                chrome.tabs.query({
                    active: true,
                    lastFocusedWindow: true
                }, function (tabs) {
                    var tab = tabs[0].id;
                    //send message to the curret tab to read all the text and store it in localstorage 
                    chrome.tabs.sendMessage(tab, "readAllText", function (response) {
                        //get text all the text of current tab from the local storage
                        chrome.storage.sync.get('allText', function (data) {
                            //summarize the text
                            summary = summarizeText(data.allText);
                            //show the summary
                            showSummary(summary, clickData, preferences);
                            //if user has text to speech enabled
                            if (preferences.tts) {
                                chrome.tts.speak(summary);
                            }
                        });
                    });

                });

            }
            else {
                //get the selectedData in summary
                summary = summarizeText(clickData.selectionText);
                showSummary(summary, clickData, preferences);
                //if user has text to speech enabled
                if (preferences.tts) {
                    chrome.tts.speak(summary);
                }
            }

        }

    });
});

function showSummary(summary, clickData, preferences) {
    //if the summarization is successful
    if (clickData.menuItemId == "summarize" && summary) {
        //user preference is show in new window
        if (preferences.summaryIn === 'window') {
            var createData = {
                "url": 'summary.html',
                "type": "popup",
                "top": 5,
                "left": 5,
                "width": screen.availWidth / 2,
                "height": parseInt(2 * (screen.availHeight / 3))
            };
            //add summary to the local storage
            chrome.storage.sync.set({ 'summary': summary });
            //create the new overlay window         
            chrome.windows.create(createData);
        }
        else { //user preference is show in a notification box
            //create the notification option
            var notifOptions = {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('images/sum24.svg'),
                title: 'Summarized!',
                message: summary
            };
            //create the notification
            chrome.notifications.create('summarizeNotif', notifOptions);
        }
    }
}

//Summarizes text
function summarizeText(text) {
    //Summarization library used from https://github.com/wkallhof/js-summarize. Thanks to wkallhof! 
    var summary = "";
    var summarizer = new JsSummarize(
        {
            returnCount: 3
        });
    var summaryArr = summarizer.summarize("", text);
    summaryArr.forEach(function (sentence) {
        summary += ("<li>" + sentence + "</li>");
    });
    return summary;
}