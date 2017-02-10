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