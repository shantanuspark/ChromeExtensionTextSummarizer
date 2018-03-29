console.log("joi");
chrome.storage.sync.get(['summaryIn', 'summaryOf', 'tts'], function (preferences) {
    //Get all text and put in local storage if user preferences is to summarize compelete page
    console.log(preferences.summaryOf);
    if (preferences.summaryOf == 'page') {
        var text = document.body.innerText;
        chrome.storage.sync.set({ 'allText': text });
    }
});
