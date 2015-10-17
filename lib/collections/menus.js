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
	"entries.$.menuItemId":{
		type: String
	},
	"entries.$.locations":{
		type: [String],
		optional: true
	}
});

Menus.attachSchema(Schema.menu);

Meteor.methods({
	addNewMenu: function(params){

	},
	editMenu: function(menuId, params){

	},
	clearMenu: function(menuId){

	}
});