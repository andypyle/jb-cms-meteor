Clients = new Mongo.Collection('clients');

Schema = {};

Schema.client = new SimpleSchema({
	name: {
		type: String
	},
	locations: {
		type: [String]
	}
});

Clients.attachSchema(Schema.client);

Meteor.methods({
	addNewClient: function(params){
		check(params, {
			name: String,
			locations: [String],
			createdOn: Number
		});

		return Clients.insert(params);
	},
	editClient: function(clientId, params){
		check(params, {
			name: String,
			locations: [String]
		});

		return Clients.update({
			_id: clientId
		},{$set: params});
	},
	removeClient: function(clientId){
		return Clients.remove(clientId);
	}
});