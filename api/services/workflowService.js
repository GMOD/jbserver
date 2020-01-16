/*
    This is a sample Job Service that is recognized by JBClient.

    To enable: add the sampleJobService line under services and disable the other services.

    module.exports  = {
        jbrowse: {
            services: {
                'sampleJobService':         {enable: true,  name: 'sampleJobService    ',  type: 'workflow', alias: "jblast"},
                'basicWorkflowService':     {enable: false, name: 'basicWorkflowService',  type: 'workflow', alias: "jblast"},
                'galaxyService':            {enable: false, name: 'galaxyService',         type: 'workflow', alias: "jblast"}
            },
        }
    };

*/
/* istanbul ignore file */
var fs = require("fs-extra");
var approot = require("app-root-path");

module.exports = {

    //  in the function map (fmap), get_workflow function is minimally require from the Process BLAST dialog.
    //  get_hit_details is not required since we don't actaully do a blast operation in the example.
    fmap: {
        get_workflows:      'get'
    },

    //  (required by Job Service)
    //  perform any initialization on the module
    init(params,cb) {
        return cb();
    },

    //  (required by Job Runner Service)
    //  provides mechanism to validate parameters of the job service
    validateParams(params) {
        if (typeof params.region === 'undefined') return "region not undefined";
        return 0;   // success
    },

    //  (required by Job Runner Service)
    //  job service generate readable name for the job that will appear in the job queue
    generateName(params) {
        return params.workflow;
    },

    //  (required by Job Runner Service)
    //  Return a list of available workflow scripts.  This is used to populate the Plugin's workflow.
    //  This should minimally return at least one item.
    //  Here, we are just passing a dummy list.
    get_workflows (req, res) {
        
        let params = req.allParams();
        let g = sails.config.globals.jbrowse;
        let ds = params.dataset;
        
        var wfpath = './workflows/';
        
        sails.log(wfpath,process.cwd());
        
        var fs = require('fs-extra');

        wflist = [];
        
        fs.readdirSync(wfpath).forEach(function(file) {
            if (file.indexOf('.workflow.') !== -1) {
                
                var name = file.split('.workflow.');
                
                wflist.push( {
                   id: file,
                   name: name[0],
                   script: file,
                   path: resolvePath(wfpath)
                });
            }
        });

        // handle filtering of workflow names (ref #225)
        // if (g.jblast.workflowFilterEnable && g.jblast.workflowFilter && g.jblast.workflowFilter.galaxy && g.jblast.workflowFilter.galaxy[ds]) {
        //     let workflows = _.cloneDeep(wflist);
        //     let nf = g.jblast.workflowFilter.galaxy[ds].nameFilter;
        //     let filtered = [];
            
        //     for(let i in workflows) {
        //         if (workflows[i].name.indexOf(nf) >= 0) {
        //             workflows[i].name = workflows[i].name.replace(nf,"");
        //             filtered.push(workflows[i]);
        //         }
        //     }
        //     console.log("get_workflows filtered",filtered);
        //     return res.ok(filtered);
        // }
        
        console.log("get_workflows",wflist);

        res.ok(wflist);
    },

    // (required by Job Runner Service)
    // this is called by the job execution engine to begin processing
    beginProcessing(kJob) {
        let thisb = this;
        let nothingName = "sample nothing ";
        
        kJob.data.count = 10;   // 10 seconds of nothing
       
        let f1 = setInterval(function() {
            if (kJob.data.count===0) {
                clearInterval(f1);
                thisb._postProcess(kJob);
            }
            kJob.data.name = nothingName+kJob.data.count--;
            kJob.update(function() {});
        },1000);
    },

    //  (not required)
    //  After the job completes, we do some processing in postDoNothing() and then call 
    //  addToTrackList to insert a new track into JBrowse
    _postProcess(kJob) {
        
        // insert track into trackList.json
        this.postDoNothing(kJob,function(newTrackJson) {
            postAction.addToTrackList(kJob,newTrackJson);
        });
    },

    //  (not required)
    //  here, we do some arbitrary post prosessing.
    //  in this example, we are setting a dummy jbrowse track data.    
    postDoNothing(kJob,cb) {

        let templateFile = approot+'/bin/nothingTrackTemplate.json';
        let newTrackJson = [JSON.parse(fs.readFileSync(templateFile))];
        
        let trackLabel = kJob.id+' sample job results';
        
        newTrackJson[0].label = "SAMPLEJOB_"+kJob.id+Math.random(); 
        newTrackJson[0].key = trackLabel;     
        
        kJob.data.track = newTrackJson[0];
        kJob.update(function() {});

        cb(newTrackJson);
    }
    
};
