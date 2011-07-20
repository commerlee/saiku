var Query = Backbone.Model.extend({
    initialize: function(args) {
        // Save cube
        this.cube = args.cube;
        this.unset('cube', { silent: true });
        
        // Generate a unique query id
        this.name = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
        
        // Parse cube information
        this.parse_cube();
        
        // Create the query on the server workspace
        this.save();
        
        // Initialize properties object
        this.properties = new Properties({ query: this });
        
        // Initialize action handler
        this.action = new QueryAction({ query: this });
        
        // Initialize result handler
        this.result = new Result({ query: this });
                
        // Bind `this`
        _.bindAll(this, "run", "move_dimension");
    },
    
    parse: function() {
        // Assign id so Backbone knows to PUT instead of POST
        this.id = this.name;
        
        // Fetch initial properties from server
        this.properties.fetch({
            success: this.workspace.toolbar.reflect_properties
        });
    },
    
    parse_cube: function() {
        var parsed_cube = this.cube.split('/');
        this.set({
            connection: parsed_cube[0],
            catalog: parsed_cube[1],
            schema: parsed_cube[2],
            cube: parsed_cube[3]
        });
    },
    
    run: function(force) {
        // Check for automatic execution
        if (! this.properties.properties['saiku.olap.query.automatic_execution'] &&
            ! force) {
            return;
        }
        
        // TODO - Validate query
        
        // Run it
        $(this.workspace.el).find('.workspace_results')
            .text('Running query...');
        this.result.fetch();
    },
    
    move_dimension: function(dimension, $target_el, index) {
        $(this.workspace.el).find('.run').removeClass('disabled_toolbar');
        
        var target = '';
        if ($target_el.hasClass('rows')) target = "ROWS";
        if ($target_el.hasClass('columns')) target = "COLUMNS";
        if ($target_el.hasClass('filter')) target = "FILTER";
        
        var url = "/axis/" + target + "/dimension/" + dimension;
        
        this.action.post(url, function() {
            if (this.query.properties
                .properties['saiku.olap.query.automatic_execution'] === 'true') {
                this.query.run();
            }
        });
    },
    
    url: function() {
        return Saiku.session.username + "/query/" + this.name;
    }
});