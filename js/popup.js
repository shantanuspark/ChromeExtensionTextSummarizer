$(function(){

    chrome.storage.sync.get(['summaryIn','summaryOf','tts'], function(preferences){
        if(preferences.summaryIn){
            if(preferences.summaryIn === 'window'){
                $('#summaryIn').text("New Window")
            } else {
                $('#summaryIn').text("Notification Popup")
            };
        }
        if(preferences.summaryOf){
            if(preferences.summaryOf === 'page'){
                $('#summaryOf').text("Whole Page");
            } else {
                $('#summaryOf').text("Selected Text");
            }
        }
        if(preferences.tts != undefined){
            if(preferences.tts){
                $('#tts').text("Yes");
            } else {
                $('#tts').text("No");               
            }
        }
    });

    $('#updatePref').click(function(){
        chrome.tabs.create({ url: "options.html" });
    });
});