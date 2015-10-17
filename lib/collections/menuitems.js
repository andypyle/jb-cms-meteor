MenuItems = new Mongo.Collection('menuItems');

Schema = {};

Schema.menuItem = new SimpleSchema({
	name: {
		type: String
	},
	ingredients: {
		type: String
	},
	allergies: {
		type: [String]
	},
	versions: {
		type: [String]
	},
	order: {
		type: Number,
		optional: true
	},
	rating: {
		type: Number,
		min: 1,
		max: 5,
		optional: true
	},
	ratingCount: {
		type: Number,
		optional: true
	},
	createdOn: {
		type: Number
	},
	client: {
		type: String,
		optional: true
	}	
});

MenuItems.attachSchema(Schema.menuItem);



Meteor.methods({
	addMenuItem: function(params){
		check(params, {
			name: String,
			ingredients: String,
			versions: [String],
			allergies: [String],
			createdOn: Number
		});

		return MenuItems.insert(params);
	}
});