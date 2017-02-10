function getQueryParam(name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}

$(document).ready(function(){

	// Handle the comming back from the barcode reader
	var barcode = getQueryParam('barcode');
	if (barcode) {
		$("#barcode").val(barcode);
		checkProduct(barcode);
	}

	$('#check').click(function() {
		checkProduct($("#barcode").val());
  	});

  	$('#restrictions-form').on("submit",function(e) {
	    e.preventDefault(); 
	    saveRestrictionsToLocalStorage();
	});

});


$.getJSON("data/allergens.json", function( data ) {
    var items = [];
    $.each( data, function( key, list ) {
        localStorage.setItem(key, JSON.stringify(list));
        items.push('' +
            '<div class="checkbox"><label> ' +
                '<input type="checkbox" value="'+key+'">' + key + '</br><span class="small text-muted">' + list + '</span></input>' +
            '</label></div>'
        );
    });
    $(items.join( "")).appendTo('#restrictions');
});


function saveRestrictionsToLocalStorage() {
	var checkboxs = $("#restrictions-form :checkbox");
	var unwantedNutriments = [];
	checkboxs.each(function() {
		if(this.checked == true) {
			console.log(this.value + " " + this.checked);
			unwantedNutriments = unwantedNutriments.concat(JSON.parse(localStorage.getItem(this.value)));
		}
	});
	var custom = $("#restrictions-form #custom-unwanted-nutriment")[0].value;
	if(custom) {
		unwantedNutriments = unwantedNutriments.concat(custom);
	}
	console.log(unwantedNutriments);
	localStorage.setItem("unwanted-utriments-list", JSON.stringify(unwantedNutriments));
}

function getUnwantedNutriments() {
	var unwantedNutriments = localStorage.getItem("unwanted-utriments-list");
	if(unwantedNutriments === null) {
		return [];
	}
	return JSON.parse(unwantedNutriments);
}

function checkProduct(barcode) {
	$.ajax({
		type: "GET",
        url: "https://www.openfood.ch/api/v2/products?barcodes="+barcode,
        headers: {
        'Authorization' : "Token token=ece326557b64da511d99965053239311" // don't fuck with that one!
   		}
    }).then(function(data) {
    	setName(data, barcode);
    	checkComposition(data.data[0].attributes['ingredients-translations'].fr);
    });
}

function checkComposition(composition) {
	var unwantedNutriments = getUnwantedNutriments();
	$('#check-nok').addClass('hide');
	$('#check-ok').removeClass('hide');
	for (var i = 0, len = unwantedNutriments.length; i < len; i++) {
		var unwanted = unwantedNutriments[i];
		if(composition.includes(unwanted)) {
			composition = composition.replace(unwanted, '<span class="bg-danger">'+unwanted+'</span>');
			$('#check-nok').removeClass('hide');
			$('#check-ok').addClass('hide');
		}	
	}
	$('#product-composition').html(composition);
}


function setName(data, barcode) {
	var name = data.data[0].attributes.name
	if (name == null) {
		name = 'No name for product ' + barcode + ' with id ' + data.data[0].id
	}
	$('#product-name').text(name);
}
