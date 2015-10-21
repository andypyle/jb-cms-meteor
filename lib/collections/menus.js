Menus = new Mongo.Collection('menus');

Schema = {};

Schema.menu = new SimpleSchema({
	date: {
		type: Number
	},
	clientId: {
		type: String
	},
	entries: {
		type: [Object]
	},
	"entries.$.entryId":{
		type: String
	},
	"entries.$.order":{
		type: Number,
		optional: true
	},
	"entries.$.locations":{
		type: [String],
		optional: true
	}
});

Menus.attachSchema(Schema.menu);

Meteor.methods({
	addNewMenu: function(params){
		check(params, {
			date: Number,
			clientId: String,
			entries: [Object]
		});
		return Menus.insert(params);	
	},
	editMenu: function(menuId, params){

		console.log('Params: ' + params + '\nmenuId: ' + menuId);
		return Menus.update({
				_id: menuId
			},
			{
				$set: {
					clientId: params.clientId,
					date: params.date,
					entries: params.entries
				}
			});
	},
	clearMenu: function(menuId){

	}
});