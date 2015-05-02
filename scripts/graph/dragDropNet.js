

var getD3Module = function() {
    
    var me = {};

    me.init = function(d3NetRepresentation) {
        var w = 1200,
            h = 700;

        me.nodes = d3NetRepresentation.vertices;
        me.links = d3NetRepresentation.edges;
        var json = {
            "nodes": me.nodes,
            "links": me.links
        };

        me.vis = d3.select("body").append("svg:svg")
        // var vis = d3.select("fugara-main").append("svg:svg")
            .attr("width", w)
            .attr("height", h);

        // d3.json('jsons/graph.json', function(json) {
        var force = self.force = d3.layout.force()
            .nodes(json.nodes)
            .links(json.links)
            .gravity(.05)
            .distance(100)
            .charge(-100)
            .size([w, h])
            .start();

        me.link = me.vis.selectAll("line.link")
            .data(json.links)
            .enter().append("svg:line")
            .attr("class", "link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .attr("style", function(d) { return 'stroke:'+ d.color +'; stroke-width:2'});
            

        var node_drag = d3.behavior.drag()
            .on("dragstart", dragstart)
            .on("drag", dragmove)
            .on("dragend", dragend);

        function dragstart(d, i) {
            force.stop() // stops the force auto positioning before you start dragging
        }

        function dragmove(d, i) {
            d.px += d3.event.dx;
            d.py += d3.event.dy;
            d.x += d3.event.dx;
            d.y += d3.event.dy; 
            me.tick(); // this is the key to make it work together with updating both px,py,x,y on d !
        }

        function dragend(d, i) {
            d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
            me.tick();
            force.resume();
        }

        /////////dddddddsssasasas
        me.node = me.vis.selectAll("g.node")
            .data(json.nodes)
            .enter().append("svg:g")
            .attr("class", "node")
            .call(node_drag);

        var nodeRadius = '8px';
            me.node.append("circle")
                // .attr("cx", function (d) { return d.x_axis; })
                // .attr("cy", function (d) { return d.y_axis; })
                .attr("r", function (d) { return nodeRadius; })
                .style("fill", me.changeColor);


        var appendText = function(node) {
            me.node.append("svg:text")
                .attr("class", "nodetext")
                .attr("dx", 12)
                .attr("dy", ".35em")
                .text(function(d) { return d.name });
        };
        appendText(me.node);

        force.on("tick", me.tick);        
    };


    // Private Methods
    me.changeColor = function(d) {
        return d.verticeRef.layers.getLayer('SignalLayer').currColor;
    };




    // Callbacks for the Net 
    me.preCycleOps = function(args) {
        _.each(args.allEdges, function(e){ 
            e.color = 'blue';
        });
    };

    me.externalActivationCallback = function(args) {
        args.edge.color = 'red';
    };


    me.tick = function () {
            me.link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; })
              .attr("style", function(d) { return 'stroke:'+ d.color +'; stroke-width:4'});

            me.node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
            // node.style("fill", changeColor);
            me.vis.selectAll("g.node circle")
                .style("fill", me.changeColor);
            // Change node's text
            me.vis.selectAll("g.node text")
                    .text(function(d) {  
                        return d.name;  
                    });
            // node.text(function(d) { return d.name });
                // .text(function(){return 'aaaa'})

            //todo: We should move this out of here as it should only happen once
            me.link.on('click', function(d, i) {
                console.log('yaaay');
                d.color = 'red';
                d.source.verticeRef.layers.getLayer('SignalLayer').triggerSignal()
                d.target.verticeRef.layers.getLayer('SignalLayer').triggerSignal()
                me.tick();
            });
            me.node.on('click', function(d) {
                d.verticeRef.layers.getLayer('SignalLayer').triggerSignal();
                console.log('link yaaay!!!');
            });
        };
    return me;
};





