/**
 * @description 
 * This is the client component of ``api/services/serverSearchService``.
 *    
 */
define([
           'dojo/_base/declare',
           'dojo/_base/lang',
           'dojo/Deferred',
            'dijit/MenuItem',
            'dijit/Dialog',
           'JBrowse/Plugin',
           './View/SearchSeqDialog'
       ],
       function(
           declare,
           lang,
           Deferred,
           dijitMenuItem,
           Dialog,
           JBrowsePlugin,
           SearchSeqDialog
       ) {
return declare( JBrowsePlugin,
{
    constructor: function( args ) {
        console.log("plugin: ServerSearch");
        this._searchTrackCount = 0;

        var thisB = this;
        this.browser.afterMilestone('initView', function() {
            if (thisB.browser.loginState) {
                this.browser.addGlobalMenuItem( 'file', new dijitMenuItem(
                        {
                            label: 'Queue sequence search',
                            iconClass: 'dijitIconSearch',
                            onClick: lang.hitch(this, 'createSearchTrack')
                        }));
             }
        }, this );

    },

    createSearchTrack: function() {

        var searchDialog = new SearchSeqDialog();
        
        var thisB = this;
        searchDialog.show(
            function( searchParams ) {
                if( !searchParams )
                    return;
                
                // show confirm submit box
                var confirmBox = new Dialog({ title: 'Confirmation' });
                dojo.create('div', {
                    id: 'confirm-btn',
                    innerHTML: 'Sending Search Job...'
                }, confirmBox.containerNode );
                confirmBox.show();

                var postData = {
                    service: "serverSearchService",
                    dataset: thisB.browser.config.dataRoot,
                    searchParams: searchParams
                };
                var url = "/service/exec/submit_search";
                url = "/job/submit";
                $.post(url, postData, function(data) {
                    console.log( 'submit_search result',data );
                    
                    // close confirm box after 2 sec
                    setTimeout(function(){
                        confirmBox.destroyRecursive();
                    }, 2000);
                },'json')
                .fail(function(err) {
                    confirmBox.destroyRecursive();
                    alert( "Failed to submit search.  Check network.",err.statusText);
                });


            });
}

});
});
