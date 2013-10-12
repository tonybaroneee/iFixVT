$(function(){
    $('#report-issue-btn').on('click',function() {
        $('#add-issue-modal')
            .modal('setting', 'transition', 'vertical flip')
            .modal('show')
        ;
    });

    $('#view-issues-btn').on('click',function() {
        addPoint("44.4899859","-73.1852298");
    });
});