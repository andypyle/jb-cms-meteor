Array.prototype.move = function(from,to){
	this.splice(to,0,this.splice(from,1)[0]);
	return this;
};

Controller('cmaMenusMain', {
	created: function(){
		var currentDay = moment().format('YYYY-MM-DD');
		var currentDayMs = parseInt(moment(currentDay).format('x'));

		// Initial Session setup. Current day, client, entries, ids for entries, and
		// whether or not we are currently editing an existing menu.
		Session.set('menuCurrentDay', currentDayMs);
		Session.set('menuCurrentClient', null);
		Session.set('menuCurrentEntries', []);
		Session.set('menuCurrentEntriesIds', []);
		Session.set('editing', false);

		var instance = this;

		// Any code in each Tracker gets automatically re-run when any data inside of it
		// changes. This is immediately reflected in the DOM.
		Tracker.autorun(function(compSessions) {
			// Map all associated ids with menuCurrentEntries to their own array, so we can
			// find them in the database.
			var menuCurrentEntriesIds = Session.get('menuCurrentEntries').map(function(entry,index){
				return entry.entryId;
			});
			Session.set('menuCurrentEntriesIds', menuCurrentEntriesIds);
			instance.subscribe('menuItemsNewMenu', menuCurrentEntriesIds);
			instance.subscribe('allClients');
		});
			
		// This Tracker fetches the associated menu entries with the current menu.
		Tracker.autorun(function(compEntries){
			instance.menuEntries = function(){
				// .find() returns an array which I can map. This allows me to extend
				// each object in the array with its own order property.
				var allMenuItems = MenuItems.find({
					_id: {
						$in: Session.get('menuCurrentEntriesIds')
					}
				}).map(function(cursorObject, index){
					var menuEntrySession = Session.get('menuCurrentEntries');
					for(var i = 0; i < menuEntrySession.length; i++){
						if(menuEntrySession[i].entryId === cursorObject._id){
							_.extend(cursorObject, {order:menuEntrySession[i].order});
						}
					}
					return cursorObject;
				});		
				return allMenuItems;
			};			
			
			instance.getSortedEntries = function(){
				return instance.menuEntriesMapped;
			}			

			instance.listAllClients = function(){
				return Clients.find({});
			}
		});

		// This Tracker is for selecting a date & client, so the user can edit the corresponding menu.
		Tracker.autorun(function(compSettings){
			var currentSettings = {
				currentClient: Session.get('menuCurrentClient'),
				currentDate: Session.get('menuCurrentDay')
			};

			if(currentSettings.currentClient && currentSettings.currentDate){
				instance.subscribe('clientMenu', currentSettings.currentClient, currentSettings.currentDate);
				
				// Query the db using settings.
				var clientMenu = Menus.find({
					clientId: currentSettings.currentClient,
					date: currentSettings.currentDate
				});

				// If anything is found...
				if(clientMenu.fetch().length > 0){
					Session.set('menuCurrentEntries', clientMenu.fetch()[0].entries);
					Session.set('menuCurrentId', clientMenu.fetch()[0]._id);
					// Enable editing mode. The form submission event changes depending on whether
					// we are editing a menu or creating a new one.
					Session.set('editing', true);					
				} else {
					Session.set('menuCurrentEntries', []);
				}				
			}
		});
	},
	rendered: function(){
		// DRAGULA (DRAG AND DROP) LOGIC
		// Drag and drop from menu items in sidebar to menu.
		var dropToMenu = dragula([document.querySelector('.menuItems__list'), document.querySelector('.Menus__listofitems')],{
			copy: function (el, source) {
				return source === '.menuItems__list';
			},
			accepts: function (el, target) {
				return (target !== '.menuItems__list');
			},
			invalid: function (el, target){				
				var notFromTarget = (el.className === 'Menus__listofitems_item');
				return notFromTarget;				
			}
		})
			.on('drop', function(el, target){
				var entriesArray = Session.get('menuCurrentEntries');
				var newIndexOfDroppedItem = $(el.parentElement).children($(el)).index($(el));
				var foundIndexInEntries = _.find(entriesArray, function(entry){
					return (entry.entryId === el.dataset.itemid);
				});

				var entryIsInArray = foundIndexInEntries ? true:false;
				if(!entryIsInArray){
					entriesArray.push({entryId:el.dataset.itemid, order:newIndexOfDroppedItem});					
				}

				Session.set('menuCurrentEntries', entriesArray);

				// Remove currently dragged element from DOM, since I will be handling the rendering
				// on my own.
				el.remove();
			})
			.on('remove', function(el, container, source){
				var entriesArray = Session.get('menuCurrentEntries');
				var newIndexOfDroppedItem = $(el.parentElement).children($(el)).index($(el));
				var foundIndexInEntries = _.indexOf(entriesArray, {entryId:el.dataset.itemid});
				if(foundIndexInEntries > -1){
					entriesArray.splice(foundIndexInEntries, 1);
					Tracker.nonreactive(function(){
						Session.set('menuCurrentEntries', entriesArray);
					});					
				}
			});

		// Drag and drop for re-ordering or removing items from menu.
		dragula([document.querySelector('.Menus__listofitems')],{
			removeOnSpill: true,
			direction: 'vertical',
			moves: function (el, container, handle) {
    			return handle.className.indexOf('dragHandle') >= 0;
 			}
		})
			.on('drop', function(el){
				var newIndexOfMovedItem = $(el.parentElement).children($(el)).index($(el));
				var entriesArray = Session.get('menuCurrentEntries');
				_.each(el.parentElement.children, function(element, index, list){
					_.each(entriesArray, function(value, key, listEntries){
						if(value.entryId === element.dataset.itemid){
							value.order = index;
						}
					});
				});
				Session.set('menuCurrentEntries', _.sortBy(entriesArray,'order'));
			})
			.on('remove', function(el, source){
				var entriesArray = [].concat(Session.get('menuCurrentEntries'));
				_.each(entriesArray, function(value, key, listEntries){
					if(value.entryId === el.dataset.itemid){
						entriesArray.splice(key, 1);
						Session.set('menuCurrentEntries', entriesArray);
						//console.log('Spliced at index: ' + key + '\nRemaining objects: ' + Session.get('menuCurrentEntries'));
					}
				});
			});



		// DATEPICKER LOGIC
		var datePickerField = document.getElementById('datePicker');
		var datePickerBtn = document.getElementById('datePickerBtn');
		var datePicker = new Pikaday({
			field: datePickerField,
			trigger: datePickerBtn,
			position: 'top right',
			disableWeekends: function(){
				return true;
			},
			theme: 'dark-theme',
			format: 'MMM Do, YYYY',
			defaultDate: parseInt(moment().format('x')),
			onSelect: function() {
				// When new date is selected, set current date session variable to it.
	            Session.set('menuCurrentDay', parseInt(this.getMoment().format('x')));
	        }
		});

	},
	destroyed: function(){

	},
	helpers: {
		itemsOnMenu: function(){
			// Fetch items on current menu, ordered by their 'order' attribute.
			return _.sortBy(Template.instance().menuEntries(),'order');			
		},
		listClients: function(){
			// Fetch all clients for client selector.
			return Template.instance().listAllClients();
		},
		currentDate: function(){
			return moment().format('MMM Do, YYYY');
		}
		
	},
	events: {
		'change [name="menuClientPicker"]': function(e){
			e.preventDefault();
			Session.set('menuCurrentClient', e.target.value);
		},
		'submit [name="addMenuForm"]': function(e){
			e.preventDefault();
			var menuData = {
				date: Session.get('menuCurrentDay'),
				clientId: Session.get('menuCurrentClient'),
				entries: Session.get('menuCurrentEntries')
			}
			check(menuData, {
				date: Number,
				clientId: String,
				entries: [Object]
			});

			// Are we editing a menu that already exists?
			var editing = Session.get('editing') ? true:false;

			// If we are editing, let's fetch the _id of the current menu.
			var menuId = Session.get('menuCurrentId') || null;

			// If we are editing, call editMenu method, passing in the current menu's id
			// as an argument.
			if(editing){
				Meteor.call('editMenu', menuId, menuData, function(error, result){
					if(error){
						console.error(error);
					} else {
						console.log('Successfully changed menu!!');
					}
				});
			} else {
				// Otherwise, let's create a new menu.
				Meteor.call('addNewMenu', menuData, function(error, result){
					if(error){
						console.error(error);
					} else {
						console.log('Successfully added menu!!');
					}
				});
			}			
		}
	}
});