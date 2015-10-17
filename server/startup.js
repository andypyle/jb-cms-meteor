Meteor.startup(function(){
	var menuItemsCount = MenuItems.find().count();
	if(menuItemsCount === 0){
		var fixtureData = {
			name: 'Corndoge',
			ingredients: '1oz corn, 2oz doge',
			allergies: ['nuts','dairy','eggs'],
			versions: ['Vegan','Protein','Vegetarian'],
			order: 1,
			rating: 4,
			ratingCount: 1,
			createdOn: new Date().getTime(),
			client: 'NetFlix'
		};
		MenuItems.insert(fixtureData);
	}



	var allergiesCount = Allergies.find().count();
	if(allergiesCount === 0){
		var fixtureDataAllergies = [
			{
			name: 'Dairy',
			icon: 'dairy'
			},
			{
			name: 'Eggs',
			icon: 'eggs'
			},
			{
			name: 'Gluten',
			icon: 'gluten'
			},
			{
			name: 'Nuts',
			icon: 'nuts'
			},
			{
			name: 'Seafood',
			icon: 'seafood'
			}
		];
		
		fixtureDataAllergies.map(function(obj, index){
			Allergies.insert(obj);
		});
	}
});