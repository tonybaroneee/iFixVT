$(function(){
    $('#report-issue-btn').on('click',function() {
        $('#add-issue-modal')
            .modal('setting', 'transition', 'vertical flip')
            .modal('show')
        ;
    });

    $('#view-plain-issue-data').on('click',function() {
        activateButton(this);
    });

    $('#view-issue-count-heat-map').on('click',function() {
        activateButton(this);
    });

    $('#view-issue-density-heat-map').on('click',function() {
        activateButton(this);
    });

});