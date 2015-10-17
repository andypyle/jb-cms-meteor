Controller('cmaClient', {
	rendered: function(){
		Session.set('editClientLocations', []);
	},
	destroyed: function(){

	},
	created: function(){
		var instance = this;
		var currentId = FlowRouter.getParam("clientId");
		
		Tracker.autorun(function(){
			instance.subscribe('singleClient', currentId, function(){
				var data = instance.client();
				$('[name="name"]').val(data.name);
				Session.set('editClientLocations', data.locations);
				Session.set('clientNameEditing', data.name);
			});
		});

		instance.client = function(){
			return Clients.findOne(FlowRouter.getParam("clientId"));
		}
	},
	helpers: {
		listLocations: function(){
			return Session.get('editClientLocations');
		},
		getClientName: function(){
			return Session.get('clientNameEditing');				
		}
	},
	events: {
		'click .btnAddLocation': function(e){
			e.preventDefault();
			var clientLocations = Session.get('editClientLocations');
			var location = $('[name="locationName"]').val();

			if(clientLocations.indexOf(location) < 0){
				clientLocations.push(location);
				Session.set('editClientLocations', clientLocations);
				$('[name="locationName"]').val('');
			}
			
		},
		'click .btnDelLocation': function(e){
			e.preventDefault();
			var name = $(e.target).data('name');

			FlowRouter.subsReady(function(){
				var listOfLocations = Session.get('editClientLocations');
				var indexOfLocation = listOfLocations.indexOf(name);

				listOfLocations.splice(indexOfLocation, 1);

				Session.set('editClientLocations', listOfLocations);
			});		
			
		},
		'submit form[name="editClientForm"]': function(e){
			e.preventDefault();

			var clientId = FlowRouter.getParam("clientId");

			var edited = {
				name: $('[name="name"]').val(),
				locations: Session.get('editClientLocations')
			};
			
			Meteor.call('editClient', clientId, edited, function(error, result){
				if(error){
					console.error(error);
				} else {
					$('input').val('');
					Session.set('editClientLocations', []);
					Session.set('clientNameEditing', null);
					Meteor.setTimeout(function(){
						FlowRouter.go('cmaClientsRoute');
					}, 750);
				}
			});
			
		}
	}
});