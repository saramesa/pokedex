$("#btn-search").click(function () {
	var pokemon = $("#pokemon-search-input").val()
	var url = "http://pokeapi.co/api/v2/pokemon/" + pokemon
	request(url, "load_pokemon", " ");
})

function request (url, action) {
	$.ajax({
		url: url
	}).success (function(response) {
		if (action==="load_pokemon") {
			load_pokemon(response);
		}else if (action==="filter"){
			filterPokemon(response.pokemon);	
		}else if(action==="evolution") {
			evolutionModal(response);
		}
		
	}).error (function(jqXHR, textStatus, errorThrown){
		alert ("error: " + jqXHR + " " + textStatus + " " + errorThrown)
	});
}

function load_pokemon (response) {
	var response = response;
	var html = "";
	html += '<div class="col-md-2 styleList">' +
		'<h2>' + response.name + '</h2>' + 
		 '<img src="' + response.sprites.front_default + '" alt="image">' + 
			'<div class="description"><span>type:<span>';
			for(var i=0; i<response.types.length; i++) {
				html+= response.types[i].type.name + ' '
			}
				html += '</span></span>'+ 
				'<span>weight:<span>' + response.weight + '</span></span>' + ' ' +
				'<p><span>height:<span>' + response.height + '</span></span></p>' + 
				'<p><a id = "'+ response.id +'" href="http://pokeapi.co/api/v2/evolution-chain/' + response.id + '">Evolution</a></p>'+
			'</div>'+ 
			'</div>';
	$("#pokemonList").append(html);

	$(".description a").unbind("click").click(function(e) {
		e.preventDefault()
		var id = $(this).attr('id');
		console.log(id)
		var url = "http://pokeapi.co/api/v1/pokemon/" + id;
		request(url, "evolution");
	});
}

function evolutionModal (response) {
	$(".modal-body").empty();
	var evolution = response.evolutions[0];
	if(evolution.level='undefined') {
		evolution.level = 'no tiene'
	}
	if (response.evolutions.length>0) {
		var html =  '<table class = "table">' + 
						'<thead>' + 
							'<tr>' + 
								'<th> name </th> <th> level </th> <th> method </th>' +
							'</tr>'+
						'</thead>'+
						'<tbody>' + 
							'<tr>' +
								'<td>' + evolution.to + '</td> <td>' + evolution.level + '</td> <td>'+
								evolution.method + '</td>'+
							'</tr>'+
						'</tbody>'+
				'</table>';

		
	}else {
		var html = '<table class = "table">' + 
						'<thead>' + 
							'<tr>' + 
								'<th> name </th> <th> level </th> <th> method </th>' +
							'</tr>'+
						'</thead>'+
						'<tbody>' + 
							'<tr class="text-center">' +
								'<td> No tiene evolución</td>'+
							'</tr>'+
						'</tbody>'+
				'</table>';
	}
	$(".modal-body").append(html)
	$("#modal").modal('show')



}

$(".dropdown-menu li").click(function() {
	var type = $(this).text();
	var url = "http://pokeapi.co/api/v2/type/" + type;
	request (url,"filter");
})
function filterPokemon(array){
	$("#pokemonList").empty();

	array.slice(0,10).forEach(function (pokemon){
		request(pokemon.pokemon.url,"load_pokemon");
	});
}
	



