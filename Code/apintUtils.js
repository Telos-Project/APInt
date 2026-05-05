try {
	require("telos-use-js");
}

catch(error) {

}

var apintUtils = {
	buildAPInt: (apint, mask, path) => {

		apint = JSON.parse(JSON.stringify(apint));
		path = path != null ? path : [];

		if(mask != null) {
			
			if(mask.packages != null) {

				mask.packages.forEach(item => {

					if(apint[item] == null)
						return;

					apint.packages = Object.assign(
						apint.packages != null ? apint.packages : { },
						apint[item]
					);

					delete apint[item];
				});
			}
			
			if(mask.utilities != null) {

				mask.utilities.forEach(item => {

					if(apint[item] == null)
						return;

					apint.utilities = Object.assign(
						apint.utilities != null ? apint.utilities : { },
						apint[item]
					);

					delete apint[item];
				});
			}
		}

		if(apint.packages == null)
			return apint;

		Object.keys(apint.packages).forEach(key => {

			if(typeof apint.packages[key] == "string") {

				if(path.includes(apint.packages[key]))
					return;

				apint.packages[key] = apintUtils.buildAPInt(
					use(apint.packages[key]),
					mask,
					path.concat(apint.packages[key])
				);
			}

			else {

				apint.packages[key] = apintUtils.buildAPInt(
					apint.packages[key], mask, path
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

				if(path.length == 1 && key.toLowerCase() != path[0])
					return;

				let utility = JSON.parse(JSON.stringify(apint.utilities[key]));

				utility.properties = Object.assign(
					Object.assign({ }, inheritance),
					utility.properties != null ? utility.properties : { }
				);

				let match = true;

				if(typeof properties == "function") {

					try {
						match = properties(utility);
					}

					catch(error) {
						
					}
				}

				else {

					Object.keys(properties).forEach((item) => {
						
						if(JSON.stringify(properties[item]) !=
							JSON.stringify(utility.properties[item])) {
							
							match = false;
						}
					});
				}

				if(match)
					utilities.push(utility);
			});
		}

		if(apint.packages != null) {

			Object.keys(apint.packages).forEach(key => {

				let newPath = JSON.parse(JSON.stringify(path));

				if(typeof apint.packages[key] == "string")
					return;

				if(newPath.length > 0) {

					if(key.toLowerCase() == newPath[0])
						newPath = newPath.slice(1);
				}

				utilities = utilities.concat(
					apintUtils.queryUtilities(
						apint.packages[key], newPath, properties, inheritance
					)
				);
			});
		}

		return utilities;
	},
	use: (apint, query) => {

		try {

			if(typeof apint == "string") {

				try {
					apint = JSON.parse(apint);
				}

				catch(error) {
					apint = use(apint);
				}
			}

			let utility = apintUtils.queryUtilities(
				apintUtils.buildAPInt(
					typeof apint == "object" ? apint : JSON.parse(apint)
				),
				query
			)[0];

			if(utility == null)
				return null;

			return utility.content != null ?
				utility.content :
				use(
					Array.isArray(utility.source) ?
						utility.source[0] : utility.source
				);
		}

		catch(error) {
			return null;
		}
	}
};

if(typeof module == "object")
	module.exports = apintUtils;