Controller('menuItemsSidebar', {
	rendered: function(){
		Session.set('quickAddVisible', FlowRouter.getRouteName() === ("cmaMenuItemsRoute" || "cmaMenuItemsRouteAdd"));
		Session.set('searchSideBar', null)
	},
	destroyed: function(){

	},
	created: function(){
		var instance = this;
		
		Tracker.autorun(function() {
			instance.subscribe('menuItemsSidebar', Session.get('searchSideBar'));
			instance.menuItemsList = function(){
				if(Session.get('searchSideBar')){
					var searchString = new RegExp('.*' + Session.get('searchSideBar') + '.*', 'i');
					return MenuItems.find({name: {'$regex' : searchString}}, {fields: {'name':1}});
				}
				return MenuItems.find({});				
			}
		});
		

		
	},
	helpers: {
		menuItemsList: function(){
			return Template.instance().menuItemsList();
		},
		checkPath: function(){
			
		}
	},
	events: {
		'click .addMenuItemSidebar':function(e){
			e.preventDefault();
			if($('[name="menuItemsAdd"]').val().length > 0){
				var newItem = $('[name="menuItemsAdd"]').val();
				var addNewItemRoute = "cmaMenuItemsRouteAdd";
				var addNewItemParams = {newItemName: newItem};
				var addNewItemPath = FlowRouter.path(addNewItemRoute, addNewItemParams);
				FlowRouter.go(addNewItemPath);
				$('[name="menuItemsAdd"]').val('')
			}
		},
		'input [name="menuItemsSearch"]': function(e){
			Session.set('searchSideBar', e.target.value);
		}
	}
});