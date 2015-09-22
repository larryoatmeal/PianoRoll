/**
 * Created by Larry on 9/21/15.
 */


$( document ).ready(function(){

    //Check if audioContext is okay
    if(window.AudioContext){
        //check browser
        var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        if(!isChrome){
            showChromeModal()
        }
    }else{
        showErrorModal();
    }

    window.showHelpModal = function(){
        $('#helpModal').modal('show');
    };

    $('#helpModal').on('hidden.bs.modal', function () {
        //return focus to canvas
        document.getElementById('canvas').focus();
        $("#canvas").click();
    });

     function showErrorModal(){
        $("#webAudioApiErrorModal").modal('show');
    }

    function showChromeModal(){
        $("#chromeRecommendedModal").modal('show');
    }

});



