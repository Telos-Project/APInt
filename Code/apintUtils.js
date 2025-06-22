var apintUtils = {
	buildAPInt: (apint, path) => {

		apint = JSON.parse(JSON.stringify(apint));
		path = path != null ? path : [];

		if(apint.packages == null)
			return apint;

		Object.keys(apint.packages).forEach(key => {

			if(typeof apint.packages[key] == "string") {

				if(path.includes(apint.packages[key]))
					return;

				apint.packages[key] = apintUtils.buildAPInt(
					use(apint.packages[key]),
					path.concat(apint.packages[key])
				);
			}

			else {

				apint.packages[key] = apintUtils.buildAPInt(
					apint.packages[key], path
				);
			}
		})

		return apint;
	},
	queryUtilities: (apint, path, properties, inheritance) => {

		path = path != null ? path : [];

		if(typeof path == "string")
			path = path.split(".").map(item => item.toLowerCase());

		inheritance = inheritance != null ?
			JSON.parse(JSON.stringify(inheritance)) : { };

		properties = properties != null ? properties : { };

		if(apint.properties != null)
			Object.assign(inheritance, apint.properties);

		let utilities = [];

		if(path.length <= 1 && apint.utilities != null) {

			Object.keys(apint.utilities).forEach(key => {

				let utility = JSON.parse(JSON.stringify(apint.utilities[key]));

				utility.properties = Object.assign(
					Object.assign({ }, inheritance),
					utility.properties != null ? utility.properties : { }
				);

				let match = true;

				Object.keys(properties).forEach((item) => {
					
					if(JSON.stringify(properties[item]) !=
						JSON.stringify(utility.properties[item])) {
						
						match = false;
					}
				});

				if(match)
					utilities.push(utility);
			});
		}

		if(apint.packages != null) {

			Object.keys(apint.packages).forEach(key => {

				if(typeof apint.packages[key] == "string")
					return;

				if(path.length > 0) {

					if(key.toLowerCase() == path[0])
						path = path.slice(1);
				}

				utilities = utilities.concat(
					apintUtils.queryUtilities(
						apint.packages[key], path, properties, inheritance
					)
				);
			});
		}

		return utilities;
	},
	loadUtility: (apint, query) => {

		let utility = apintUtils.queryUtilities(apint, query)[0];

		if(utility == null)
			return null;

		return use(
			Array.isArray(utility.source) ? utility.source[0] : utility.source
		);
	}
};

if(typeof module == "object")
	module.exports = apintUtils;