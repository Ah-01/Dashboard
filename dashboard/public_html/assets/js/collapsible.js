/*  -------------------------------------------------------------------------   */
/**
 * Method used to get data from Json files.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
function getDataAndStyles() {
    var chartDataAssigned = $.Deferred();
    var chartStyleAssigned = $.Deferred();
    var parsedData, parsedStyle;
    $.getJSON("json/data.json", function (data) {
        parsedData = data;
        chartDataAssigned.resolve();
    });
    $.getJSON("json/style.json", function (data) {
        parsedStyle = data;
        chartStyleAssigned.resolve();
    });
    var necessaryDataAssigned = $.when(chartDataAssigned, chartStyleAssigned).done(function () {
        chartInitParams = {
            Data: parsedData,
            Style: parsedStyle

        }
        var graphHandle = new collapsible(chartInitParams);
        graphHandle.render();
    })
}
getDataAndStyles();
/*  -------------------------------------------------------------------------   */
/**
 * Method used to initialize variables.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */

function collapsible(chartInitParams) {
    this.parsedData = chartInitParams.Data;
    this.parsedStyle = chartInitParams.Style;
    width = 460,
            height = 350;

    this.chartStyle();
}
/*  -------------------------------------------------------------------------   */
/**
 * Method used to make the svg and its style..
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
collapsible.prototype.chartStyle = function () {
    var that = this;
    collapsibleData = [];
    collapsibleData = this.parsedData;
    svg = d3.select(".chart").append("svg")
            .attr("width", width)
            .attr("height", height);
    link = svg.selectAll(".link"),
            node = svg.selectAll(".node");
}

/*  -------------------------------------------------------------------------   */
/**
 * Method used to render the chart.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
collapsible.prototype.render = function () {
    update();
    tick();
    color();
    click();
    flatten();
}
/*  -------------------------------------------------------------------------   */
/**
 * Method used to update function.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
function update() {
    root = [];
    root = collapsibleData;
    var nodes = flatten(root),
            links = d3.layout.tree().links(nodes);
    
    var force = d3.layout.force()
            .size([width, height])
            .on("tick", tick);

    // Restart the force layout.
    force
            .nodes(nodes)
            .links(links)
            .start();
    // Update the links…
    link = link.data(links, function (d) {
        
        return d.target.id;
        
    });

    // Exit any old links.
    link.exit().remove();
    // Enter any new links.
    link.enter().insert("line", ".node")
            .attr("class", "link")
            .attr("x1", function (d) {
                
                return d.source.x;
       
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

    // Update the nodes…
    node = node.data(nodes, function (d) {
        return d.id;
    }).style("fill", color);
    // Exit any old nodes.
    node.exit().remove();
    // Enter any new nodes.
    node.enter().append("circle")
            .attr("class", "node")
            .attr("cx", function (d) {
                console.log(d);
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("r", function (d) {
                return Math.sqrt(d.size) / 10 || 4.5;
            })
            .style("fill", color)
            .on("click", click)
            .call(force.drag);
}
/*  -------------------------------------------------------------------------   */
/**
 * Method used for tick function.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
function tick() {
    link.attr("x1", function (d) {
        return d.source.x;
    })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });
    node.attr("cx", function (d) {
        return d.x;
    })
            .attr("cy", function (d) {
                return d.y;
            });
}
/*  -------------------------------------------------------------------------   */
/**
 * Method used for color of the nodes.
 * // Color leaf nodes orange, and packages white or blue.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
function color(d) {
    return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}
/*  -------------------------------------------------------------------------   */
/**
 * // Toggle children on click.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
function click(d) {
    
    if (!d3.event.defaultPrevented) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update();
    }
}
/*  -------------------------------------------------------------------------   */
/**
 *  // Returns a list of all nodes under the root.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
function flatten(root) {
    var nodes = [], i = 0;
    function recurse(node) {
        if (node.children)
            node.children.forEach(recurse);
        if (!node.id)
            node.id = ++i;
        nodes.push(node);
    }
    recurse(root);
    return nodes;
}