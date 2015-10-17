Array.prototype.move = function(from,to){
	this.splice(to,0,this.splice(from,1)[0]);
	return this;
};

Controller('cmaMenusMain', {
	created: function(){
		var currentDay = moment().format('YYYY-MM-DD');
		var currentDayMs = moment(currentDay).format('x');

		Session.set('menuCurrentDay', currentDayMs);
		Session.set('menuCurrentClient', null);
		Session.set('menuCurrentEntries', []);
		Session.set('menuCurrentEntriesIds', []);

		var instance = this;

		Tracker.autorun(function() {
			var menuCurrentEntriesIds = Session.get('menuCurrentEntries').map(function(entry,index){
				return entry.entryId;
			});
			Session.set('menuCurrentEntriesIds', menuCurrentEntriesIds);
			instance.subscribe('menuItemsNewMenu', menuCurrentEntriesIds);
			instance.subscribe('allClients');

			instance.menuEntries = function(){
				return MenuItems.find({
					_id: {
						$in: Session.get('menuCurrentEntriesIds')
					}
				});
			};

			instance.listAllClients = function(){
				return Clients.find({});
			}

			var currentSettings = {
				currentClient: Session.get('menuCurrentClient'),
				currentDate: Session.get('menuCurrentDay')
			};
		});
	},
	rendered: function(){
		// DRAGULA (DRAG AND DROP) LOGIC
		dragula([document.querySelector('.menuItems__list'), document.querySelector('.Menus__listofitems')],{
			copy: function (el, source) {
				return source === '.menuItems__list';
			},
			accepts: function (el, target) {
				return target !== '.menuItems__list';
			},
			invalid: function (el, target){
				var notFromTarget = (el.className === 'Menus__listofitems_item');
				return notFromTarget;
			}
		})
			.on('drop', function(el, target){
				var entriesArray = Session.get('menuCurrentEntries');
				var newIndexOfDroppedItem = $(target).children().length;
				console.log(newIndexOfDroppedItem);

				
				var foundIndexInEntries = _.indexOf(entriesArray, {entryId:el.dataset.itemid});
				if(foundIndexInEntries < 0){
					entriesArray.push({entryId:el.dataset.itemid, order:newIndexOfDroppedItem});
					Session.set('menuCurrentEntries', entriesArray);

					//console.log(Session.get('menuCurrentEntries'));
				}
							
				el.remove();

			});

		dragula([document.querySelector('.Menus__listofitems')],{
			removeOnSpill: true,
			direction: 'vertical',
			moves: function (el, container, handle) {
    			return handle.className.indexOf('dragHandle') >= 0;
 			}
		})
			.on('drop', function(el){
				//var newIndexOfMovedItem = $(el).parent().children().index($(el));
				//var entriesArray = Session.get('menuCurrentEntries');
				//var oldIndexOfMovedItem = entriesArray.indexOf(el.dataset.itemid);
				//var entriesReOrdered = entriesArray.move(oldIndexOfMovedItem, newIndexOfMovedItem);
				//Session.set('menuCurrentEntries', entriesReOrdered);
				//console.log(Session.get('menuCurrentEntries'));
			})
			.on('remove', function(el, source){
				var entriesArray = Session.get('menuCurrentEntries');
				if(entriesArray.indexOf(el.dataset.itemid) >= 0){
					entriesArray.splice(entriesArray.indexOf(el.dataset.itemid), 1);
					Session.set('menuCurrentEntries', entriesArray);
				}
				console.log($(source).children().length + ' elements remaining.');
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
			defaultDate: moment().format('MMM Do, YYYY'),
			onSelect: function() {
	            Session.set('menuCurrentDay', this.getMoment().format('x'));
	        }
		});


		Tracker.autorun(function(){
			
		});
	},
	destroyed: function(){

	},
	helpers: {
		itemsOnMenu: function(){
			return Template.instance().menuEntries();
		},
		itemAllergies: function(allergies){
			return Allergies.find(allergies);
		},
		listClients: function(){
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
		}
	}
});