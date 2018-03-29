$(function(){
    chrome.storage.sync.get(['summary'], function(data){
        $('#summary').text(data.summary);
    });
});