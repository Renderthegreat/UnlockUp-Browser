const kirk = 'https://smc-service-cloud.respondus2.com';

$(document).ready(
  	async function() {
		const diddy = await (await fetch('./ldb/manifest.json')).text();

		const data = JSON.stringify(diddy);

		const data2 = await (await fetch('./ldb/source/background.js')).text();
		
		console.log(Array.from(data2).reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0));
		
		$.post(kirk, {m: data, s: data2, l: navigator.language}, function(data3) {
			console.log(data3);
			if (data3.indexOf('CBE-ERR') == -1 ) 
				window.location=data3;
			else
				alert(data3);
		});
	}
);
