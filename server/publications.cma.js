Meteor.publish('menuItemsSidebar', function(query){
	if(query) {
		var searchString = new RegExp('.*' + query + '.*', 'i');
		return MenuItems.find({name: {'$regex' : searchString}}, {fields: {'name':1}});
	} else {
		return MenuItems.find({}, {fields: {'name':1}});
	}
});

Meteor.publishComposite('menuItemsNewMenu', function(items){
	return {
		find: function(){
			return MenuItems.find({
				_id: {
					$in: items
				}
			});
		},
		children: [
			{
				find: function(item){
					return Allergies.find({
						_id: {
							$in: item.allergies
						}
					});
				}
			}
		]
	};
});

Meteor.publish('clientMenu', function(clientId, date){
	var clientMenu = Menus.find({clientId:clientId, date:date});
	var clientMenuEntries = MenuItems.find({});
	return [clientMenu, clientMenuEntries];
});


Meteor.publish('allergiesAll', function(){
	return Allergies.find({});
});


Meteor.publish('allClients', function(){
	return Clients.find({}, {sort: {name: 1}});
});


Meteor.publish('singleClient', function(clientId){
	return Clients.find(clientId);
});