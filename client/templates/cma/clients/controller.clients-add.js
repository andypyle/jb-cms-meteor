Controller('cmaClientsAdd', {
	rendered: function(){
		Session.set('addClientLocations', []);		
	},
	destroyed: function(){

	},
	created: function(){
		var instance = this;

		/*
		instance.subscribe('allergiesAll');

		instance.allAllergies = function(){
			return Allergies.find({});
		}
		*/
	},
	helpers: {
		listLocations: function(){			
			return Session.get('addClientLocations');
		}
	},
	events: {
		'click .btnAddLocation': function(e){
			e.preventDefault();
			var clientLocations = Session.get('addClientLocations');
			var location = $('[name="locationName"]').val();

			clientLocations.push(location);
			Session.set('addClientLocations', clientLocations);
			$('[name="locationName"]').val('');
		},
		'click .btnDelLocation': function(e){
			e.preventDefault();
			var name = $(e.target).data('name');
			var listOfLocations = [].concat(Session.get('addClientLocations'));
			var newListOfLocations = listOfLocations.splice(listOfLocations.indexOf(name), 1);

			Session.set('addClientLocations', newListOfLocations);
		},
		'submit form[name="addClientForm"]': function(e){
			e.preventDefault();

			var clientToAdd = {
				name: $('[name="name"]').val(),
				locations: Session.get('addClientLocations'),
				createdOn: new Date().getTime()
			};
			
			Meteor.call('addNewClient', clientToAdd, function(error, result){
				if(error){
					console.error(error);
				} else {
					$('input').val('');
					Session.set('addClientLocations', []);
					Meteor.setTimeout(function(){
						FlowRouter.go('cmaClientsRoute');
					}, 750);
				}
			});
		}
	}
});