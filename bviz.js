// this collection contains all the songs
Players = new Mongo.Collection("players");
// this variable will store the visualisation so we can delete it when we need to 
var visjsobj;



//Routes recognized by any browser or iron router code

Router.configure({
    layoutTemplate: 'ApplicationLayout'
  });
  // specify the top level route, the page users see when they arrive at the site
Router.route('/', function () {
    console.log("rendering root /");
    this.render("navbar", {to:"header"});
    this.render("lobby_page", {to:"main"});
  });

Router.route('/about', function () {
      this.render("navbar", {to:"header"});
      this.render("about_page", {to:"main"});
    });

Router.route('/help', function () {
          this.render("navbar", {to:"header"});
          this.render("help_page", {to:"main"});
        });

Router.route('/history', function () {
              this.render("navbar", {to:"header"});
              this.render("history_page", {to:"main"});
            });






if (Meteor.isClient){

////////////////////////////
///// helper functions for the vis control form
////////////////////////////

  Template.song_viz_controls.helpers({
    // returns an array of the names of all features of the requested type
    get_feature_names : function(type){
      var feat_field;
      if (type == "single"){
        feat_field = "single_features";
      }
      // pull an example song from the database
      // - we'll use this to find the names of all the single features
      player = Players.findOne();
      if (player != undefined){// looks good! 
        // get an array of all the song feature names 
        // (an array of strings)
        features = Object.keys(player[feat_field]);
        features_a = new Array();
        // create a new array containing
        // objects that we can send to the template
        // since we can't send an array of strings to the template
        for (var i=0;i<features.length;i++){
            features_a[i] = {name:features[i]};
        }
        return features_a;
      }
      else {// no song available, return an empty array for politeness
        return [];
      }
    },	
  });

////////////////////////////
///// helper functions for the feature list display template
////// (provide the data for that list of songs)
////////////////////////////

// helper that provides an array of feature_values
// for all songs of the currently selected type
// this is used to feed the template that displays the big list of 
// numbers
  Template.song_feature_list.helpers({
    "get_all_feature_values":function(){
      if (Session.get("feature") != undefined){
        var players = Players.find({});

        var features = new Array();
        var ind = 0;
        // build an array of data on the fly for the 
        // template consisting of 'feature' objects
        // describing the song and the value it has for this particular feature
        players.forEach(function(player){
            features[ind] = {
              artist:player.metadata.tags.name,
              title:player.metadata.tags.team, 
              value:player[Session.get("feature")["type"]][Session.get("feature")["name"]]
            };
            ind ++;
        })
        return features;
      }
      else {
        return [];
      }
    }
  })

////////////////////////////
///// event handlers for the viz control form
////////////////////////////

  Template.song_viz_controls.events({
    // event handler for when user changes the selected
    // option in the drop down list
    "change .js-select-single-feature":function(event){
      event.preventDefault();
      var feature = $(event.target).val();
      Session.set("feature", {name:feature, type:"single_features"});
    }, 
    // event handler for when the user clicks on the 
    // blobs button
     "click .js-show-bar":function(event){
      event.preventDefault();
      initBarVis();
    }, "click .js-show-pitching-bar":function(event){
      event.preventDefault();
//      initPitchingBarVis();
    },"click .js-show-hitting-bar":function(event){
      event.preventDefault();
//      initHittingBarVis();
    },
    // event handler for when the user clicks on the 
    // blobs button
     "click .js-show-line":function(event){
      event.preventDefault();
      initLineVis();
    } ,   // event handler for when the user clicks on the 
    // blobs button
     "click .js-show-3d":function(event){
      event.preventDefault();
      init3dVis();
    } ,   // event handler for when the user clicks on the 
    // blobs button
     "click .js-show-block":function(event){
      event.preventDefault();
//      initBlockVis();
    } ,   // event handler for when the user clicks on the 
    // blobs button
     "click .js-show-tree":function(event){
      event.preventDefault();
  //    initTreeVis();
    }, 
  }); 
}



////////////////////////////
///// functions that set up and display the visualisation
////////////////////////////

// function that creates a new bar chart visualisation
function initBarVis(){
  // clear out the old visualisation if needed
  if (visjsobj != undefined){
    visjsobj.destroy();
  }
  var players = Players.find({});
  var ind = 0;
  // generate an array of items
  // from the songs collection
  // where each item describes a song plus the currently selected
  // feature
  var items = new Array();
  // iterate the songs collection, converting each song into a simple
  // object that the visualiser understands
  players.forEach(function(player){
    if (player.metadata.tags.name != undefined && 
      player.metadata.tags.name[0] != undefined ){
      var label = "ind: "+ind;
      if (player.metadata.tags.name != undefined){// we have a title
        label = player.metadata.tags.name[0] + " - " + 
        player.metadata.tags.team[0];
      }  
      var value = player[Session.get("feature")["type"]][Session.get("feature")["name"]];
      // here we create the actual object for the visualiser
      var date = "03-0"+ind+"-16";
      // and put it into the items array
      items[ind] = {
        x: date, 
        y: value, 
        // slighlty hacky label -- check out the vis-label
        // class in song_data_viz.css 
        label:{content:label, className:'vis-label', xOffset:-5}, 
      };
      ind ++ ;
  }
  });
  // set up the data plotter
  var options = {
    style:'bar', 
  };
  // get the div from the DOM that we are going to 
  // put our graph into 
  var container = document.getElementById('visjs');
  // create the graph
  visjsobj = new vis.Graph2d(container, items, options);
  // tell the graph to set up its axes so all data points are shown
  visjsobj.fit();
}


// function that creates a new  line chart visualisation
function initLineVis(){
  // clear out the old visualisation if needed
  if (visjsobj != undefined){
    visjsobj.destroy();
  }
  var players = Players.find({});
  var ind = 0;
  // generate an array of items
  // from the songs collection
  // where each item describes a song plus the currently selected
  // feature
  var items = new Array();
  // iterate the songs collection, converting each song into a simple
  // object that the visualiser understands
  players.forEach(function(player){
    if (player.metadata.tags.name != undefined && 
      player.metadata.tags.name[0] != undefined ){
      var label = "ind: "+ind;
      if (player.metadata.tags.name != undefined){// we have a title
        label = player.metadata.tags.name[0] + " - " + 
        player.metadata.tags.team[0];
      }  
      var value = player[Session.get("feature")["type"]][Session.get("feature")["name"]];
      var date = "03-05-0"+ind;
      // here we create the actual object for the visualiser
      // and put it into the items array
      items[ind] = {
        x: date, 
        y: value, 
        // slighlty hacky label -- check out the vis-label
        // class in song_data_viz.css 
        label:{content:label, className:'vis-label', xOffset:-5}, 
      };
      ind ++ ;
  }
  });
  // set up the data plotter
  var options = {
  };
  // get the div from the DOM that we are going to 
  // put our graph into 
  var container = document.getElementById('visjs');
  // create the graph
  visjsobj = new vis.Graph2d(container, items, options);
  // tell the graph to set up its axes so all data points are shown
  visjsobj.fit();
}



// function that creates a new  line chart visualisation
function initHittingBarVis(){
  // clear out the old visualisation if needed
  if (visjsobj != undefined){
    visjsobj.destroy();
  }
  var players = Players.find({});
  var ind = 0;
  // generate an array of items
  // from the songs collection
  // where each item describes a song plus the currently selected
  // feature
  var items = new Array();
  // iterate the songs collection, converting each song into a simple
  // object that the visualiser understands
  players.forEach(function(player){
    if (player.metadata.tags.name != undefined && 
      player.metadata.tags.name[0] != undefined ){
      var label = "ind: "+ind;
      if (player.metadata.tags.name != undefined){// we have a title
        label = player.metadata.tags.name[0] + " - " + 
        player.metadata.tags.team[0];
      }  
      var value = player[Session.get("feature")["type"]][Session.get("feature")["name"]];
      var date = "03-0"+ind+"-16";
      // here we create the actual object for the visualiser
      // and put it into the items array
      items[ind] = {
        x: date, 
        y: value, 
        // slighlty hacky label -- check out the vis-label
        // class in song_data_viz.css 
        label:{content:label, className:'vis-label', xOffset:-5}, 
      };
      ind ++ ;
  }
  });
  // set up the data plotter
  var options = {
    style:'bar', 
  };
  // get the div from the DOM that we are going to 
  // put our graph into 
  var container = document.getElementById('visjs');
  // create the graph
  visjsobj = new vis.Graph2d(container, items, options);
  // tell the graph to set up its axes so all data points are shown
  visjsobj.fit();
}

// function that creates a new blobby visualisation
function init3dVis(){
  // clear out the old visualisation if needed
  if (visjsobj != undefined){
    visjsobj.destroy();
  }
  // find all songs from the Songs collection
  var players = Players.find({});
  var nodes = new Array();
  var ind = 0;



//sample code from visjs
    // Create and populate a data table.
    var data = new vis.DataSet();
    // create some nice looking data with sin/cos
    var counter = 0;
    var x = 0;
    var steps = 50;  // number of datapoints will be steps*steps
    var axisMax = 314;
    var axisStep = axisMax / steps;
    players.forEach(function(player){
      // set up a label with the song title and artist
     console.log("another player"+player.metadata.tags.team[0]);
 //    var label = "ind: "+ind;
 //    if (player.metadata.tags.name[0] != undefined){// we have a title
 //         label = player.metadata.tags.name[0] + " - " + 
 //         player.metadata.tags.team[0];
 //     } 
      // figure out the value of this feature for this song
      var v = player[Session.get("feature")["type"]][Session.get("feature")["name"]];
//    for (var x = 0; x < axisMax; x+=axisStep) {
    x+=axisStep;
        for (var y = 0; y < axisMax; y+=axisStep) {
            var value = (Math.sin(x/50) * Math.cos(y/50) * 50 + 50*v);
            data.add({id:counter++,x:x,y:y,z:value,style:value});
    }
});

    // specify options
    var options = {
        width:  '500px',
        height: '552px',
        style: 'surface',
        showPerspective: true,
        showGrid: true,
        showShadow: false,
        keepAspectRatio: true,
        verticalRatio: 0.5
    };

    // Instantiate our graph object.
    var container = document.getElementById('visjs');
    var graph3d = new vis.Graph3d(container, data, options);

}


