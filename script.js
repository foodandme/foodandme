$(document).ready(function(){
	$('#check').click(function() {
		findProduct($( "#barcode" ).val());
  	});
});

$.getJSON("data/allergens.json", function( data ) {
    var items = [];
    $.each( data, function( key, list ) {
        localStorage.setItem("allergens-product-list", list);
        items.push('' +
            '<div class="checkbox"><label> ' +
                '<input type="checkbox" value="'+key+'">' + key + '</input>' +
            '</label></div>'
        );
    });
    $(items.join( "")).appendTo('#restrictions');
});

function findProduct(barcode) {
	$.ajax({
		type: "GET",
        url: "https://www.openfood.ch/api/v2/products?barcodes="+barcode,
        headers: {
        'Authorization' : "Token token=ece326557b64da511d99965053239311" // don't fuck with that!
   		}
    }).then(function(data) {
       $('#product-name').text(data.data[0].attributes.name);
       $('#product-composition').text(data.data[0].attributes['ingredients-translations'].fr);
    });
}
