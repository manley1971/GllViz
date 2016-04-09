
// define a startup script that
// reads the JSON data files from the filesystem
// and inserts them into the database if needed

if (Meteor.isServer){
	Meteor.startup(function(){
//		Players.remove({});
		if (!Players.findOne()){
		console.log("no players yet... creating from filesystem");
		// pull in the NPM package 'fs' which provides
		// file system functions
		var fs = Meteor.npmRequire('fs');
		// get a list of files in the folder private/jsonfiles, which
		// ends up as assets/app/jsonfiles in the app once it is built
		var files = fs.readdirSync('./assets/app/jsonfiles/');
		// iterate the files, each of which should be a
		// JSON file containing player data.
		var inserted= 0;
		for (var i=0;i<files.length; i++){
		//for (var i=0;i<1; i++){

		 	var filename = 'jsonfiles/'+files[i];
		 	// in case the file does not exist, put it in a try catch
		 	try{
		 		var player= JSON.parse(Assets.getText(filename));
				console.log("file was parsed");
		 		// get set of properties
		 		var single_features = {};
		 		var array_features = {};
		 		var string_features = {};

		 		rhythm_keys = Object.keys(player.stats);
      			for (var j=0;j<rhythm_keys.length;j++){
  //    				console.log("type of "+rhythm_keys[j]+" is "+typeof(player.stats[rhythm_keys[j]]));
      				// only use features that are numbers ... ignore arrays etc.
      				if (typeof(player.stats[rhythm_keys[j]]) === "number"){
      					single_features[rhythm_keys[j]] = player.stats[rhythm_keys[j]];
      				}

      			}
		 		// insert the player to the DB:
		 		//
		 		player.single_features = single_features;
		 		player.array_features = array_features;
		 		player.string_features = string_features;

		 		Players.insert(player);
		 		inserted ++;
		 	}catch (e){
		 		console.log("error parsing file "+filename);
		 	}
		}
		console.log("Inserted "+inserted+" new players...");
	}
	})
}
