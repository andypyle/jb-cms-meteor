Controller('layoutCma', {
	created: function(){
		Tracker.autorun(function(){
			FlowRouter.watchPathChange();
			Session.set('sidebarVisible', FlowRouter.getRouteName() === "cmaMenusRoute");
		});
		
	},
	rendered: function(){
		/*
		dragula([document.querySelector('.menuItems__list'), document.querySelector('.Menus__listofitems')],{
			copy: function (el, source) {
				return source === '.menuItems__list';
			},
			accepts: function (el, target) {
				return target !== '.menuItems__list';
			}
		})
			.on('drop', function(el){
				$(el).removeClass('menuItems__list-item').addClass('Menus__listofitems_item');
				Event.emit('menuItemDropped', {
					data: el.dataset.itemid
				});
			});
		*/
	},
	destroyed: function(){

	},
	helpers: {
		sidebarVisible: function(){
			return Session.get('sidebarVisible');
		}
	},
	events: {

	}
});