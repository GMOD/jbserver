/**
 * @module
 * @description
 * REST Interfaces for Dataset model
 * 
 * Datasets are configure in ``config/globals.js`` file.
 * 
 * See Dataset Model
 * 
 * **Subscribe to Dataset events:**
 * ::
 *   io.socket.get('/dataset', function(resData, jwres) {console.log(resData);});
 *   io.socket.on('dataset', function(event){
 *      consol.log(event);
 *   }
 * 
 */

module.exports = {
    /**
     * Enumerate or search datasets
     * 
     * ``GET /dataset/get``
     * 
     * @param {object} req - request data
     * @param {object} res - response data
     */
    get: function(req,res) {
        var params = req.allParams();
        sails.log("/dataset/get",params);

        /* istanbul ignore else */
        if (req.method === 'GET') {
            Dataset.Get(params,function(err,records) {
                /* istanbul ignore next */
                if (err) res.serverError(err);
                /* istanbul ignore next */
                if (records.length===0) return res.notFound();
                
                return res.ok(records);
            });
        } 
        else 
            return res.forbidden('requires POST');
    }
	
};

