$.getJSON("data/allergens.json", function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
        console.log(key, val);
        items.push( "<input type='checkbox' id='" + key + "'>" + key + "</input>" );
    });

    $(items.join( "")).appendTo('#restrictions');
});