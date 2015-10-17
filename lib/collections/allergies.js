Allergies = new Mongo.Collection('allergies');

Schema = {};

Schema.allergy = new SimpleSchema({
	name: {
		type: String
	},
	icon: {
		type: String
	}
});

Allergies.attachSchema(Schema.allergy);