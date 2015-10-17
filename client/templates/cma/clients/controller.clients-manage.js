Controller('cmaClientsManage', {
	rendered: function(){
			
	},
	destroyed: function(){

	},
	created: function(){
		var instance = this;

		instance.subscribe('allClients');

		instance.allClients = function(){
			return Clients.find({});
		}
	},
	helpers: {
		listClients: function(){
			return Template.instance().allClients();
		}
	},
	events: {
		'click .btnRemove': function(e){
			e.preventDefault();
			var clientName = $(e.target).data('clientname');
			var clientId = $(e.target).data('clientid');
			var confirmRemoveClient = confirm('Removing client: ' + clientName + '\nAre you sure?');

			if(confirmRemoveClient){				
				Meteor.call('removeClient', clientId, function(error, result){
					if(error){
						console.error(error);
					}
				});				
			}
		}
	}
});