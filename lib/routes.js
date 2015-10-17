// ### CDA route group.

var cda = FlowRouter.group({
	prefix: ''
});

// ### CDA routes
cda.route('/', {
	action: function(params, queryParams){
		BlazeLayout.render('layoutCda', {main:'cdaMain'});
	},
	name: 'cda.main'
});







// ### CMA route group.

var cma = FlowRouter.group({
	prefix: '/masterchef'
});

// ### CMA routes
cma.route('/', {
	action: function(params, queryParams){
		BlazeLayout.render('layoutCma', {main:'cmaMain'});
	},
	name: 'cma.main'
});


cma.route('/clients', {
	action: function(params, queryParams){
		BlazeLayout.render('layoutCma', {main:'cmaClientsManage'});
	},
	name: 'cmaClientsRoute'
});

cma.route('/clients/add', {
	action: function(params, queryParams){
		BlazeLayout.render('layoutCma', {main:'cmaClientsAdd'});
	},
	name: 'cmaClientsAddRoute'
});

cma.route('/clients/:clientId', {
	action: function(params, queryParams){
		BlazeLayout.render('layoutCma', {main:'cmaClient'});
	},
	name: 'cmaClientsEditRoute'
});




cma.route('/menus', {
	action: function(params, queryParams){
		BlazeLayout.render('layoutCma', {main:'cmaMenusMain'});
	},
	name: 'cmaMenusRoute'
});




cma.route('/menuitems/add', {
	action: function(params, queryParams){
		BlazeLayout.render('layoutCma', {main:'cmaMenuItemsMain'});
	},
	name: 'cmaMenuItemsRoute'
});


cma.route('/menuitems/add/:newItemName', {
	action: function(params, queryParams){
		BlazeLayout.render('layoutCma', {main:'cmaMenuItemsMain'});
	},
	name: 'cmaMenuItemsRouteAdd'
});