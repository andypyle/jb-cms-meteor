

Controller('cmaMenuItemsMain', {
	rendered: function(){
		Session.set('addMenuItemsVersions', []);
		Session.set('addMenuItemsAllergies', []);

		if(FlowRouter.getParam("newItemName")){
			$('[name="name"]').val(FlowRouter.getParam("newItemName"));
		}

		$('[name="ingredients"]').val('');
	},
	destroyed: function(){

	},
	created: function(){
		var instance = this;
		instance.subscribe('allergiesAll');

		instance.allAllergies = function(){
			return Allergies.find({});
		}
	},
	helpers: {
		listVersions: function(){			
			return Session.get('addMenuItemsVersions');
		},
		listAllergies: function(){
			return Template.instance().allAllergies();
		},
		enabledAllergy: function(allergy){
			return Session.get('addMenuItemsAllergies').indexOf(allergy) >= 0 ? 'Allergy__icon-enabled':'Allergy__icon-disabled';
		}
	},
	events: {
		'click .btnAddVersion': function(e){
			e.preventDefault();
			var menuItemsVersions = Session.get('addMenuItemsVersions');
			var version = $('[name="versionName"]').val();

			menuItemsVersions.push(version);
			Session.set('addMenuItemsVersions', menuItemsVersions);
			$('[name="versionName"]').val('');
		},
		'click .btnDelVersion': function(e){
			e.preventDefault();
			var name = $(e.target).data('name');
			var listOfVersions = [].concat(Session.get('addMenuItemsVersions'));
			var newListOfVersions = listOfVersions.splice(listOfVersions.indexOf(name), 1);

			Session.set('addMenuItemsVersions', listOfVersions);
		},
		'click .Allergy__select': function(e){
			e.preventDefault();
			var selectedAllergy = $(e.target).parent().data('id');
			var allergyList = [].concat(Session.get('addMenuItemsAllergies'));
			if(allergyList.indexOf(selectedAllergy) < 0){
				allergyList.push(selectedAllergy);
			} else {
				allergyList.splice(allergyList.indexOf(selectedAllergy), 1);
			}			
			Session.set('addMenuItemsAllergies', allergyList);
			console.log(Session.get('addMenuItemsAllergies'));
		},
		'submit form[name="addMenuItemForm"]': function(e){
			e.preventDefault();
			var menuItemToAdd = {
				name: $('[name="name"]').val(),
				ingredients: $('[name="ingredients"]').val(),
				versions: Session.get('addMenuItemsVersions'),
				allergies: Session.get('addMenuItemsAllergies'),
				createdOn: new Date().getTime()
			};

			Meteor.call('addMenuItem', menuItemToAdd, function(error, result){
				if(error){
					console.error(error);
				} else {
					$('input, textarea').val('');
					Session.set('addMenuItemsVersions', []);
					Session.set('addMenuItemsAllergies', []);
					if(FlowRouter.getParam("newItemName")){
						FlowRouter.setParams({newItemName: null});
					}
				}
			});
		}
	}
});