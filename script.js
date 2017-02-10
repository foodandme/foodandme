$(document).ready(function(){
	$('#check').click(function() {
		checkProduct($( "#barcode" ).val());
  	});
});

$.getJSON("data/allergens.json", function( data ) {
    var items = [];
    $.each( data, function( key, list ) {
        localStorage.setItem("allergens-product-list", list);
        items.push('' +
            '<div class="checkbox"><label> ' +
                '<input type="checkbox" value="'+key+'">' + key + '</br><span class="small text-muted">' + list + '</span></input>' +
            '</label></div>'
        );
    });
    $(items.join( "")).appendTo('#restrictions');
});

function getUnwantedNutriments() {
	return ["épices", "huile de palme"]; // TODO load from localstorage
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
	$('#check-ok').removeClass('hide');
	console.log(unwantedNutriments);	
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
