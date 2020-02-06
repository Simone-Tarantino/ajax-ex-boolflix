// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo "title"
// Titolo Originale "original_title"
// Lingua "original_language"
// Voto "vote_average"

$(document).ready(function(){
  $(document).on('click', '.search-film', function(){
    var inputFilm = $('.film-input').val();
    $.ajax({
      url: 'https://api.themoviedb.org/3/search/movie',
      method: 'GET',
      data: {
        api_key: '1fedcc210c1f6d12a58971ab67657552',
        query: inputFilm
      },
      success: function(data){
        findFilm(data);
      },
      error: function(request, state, errors){

      }
    });
  });


  function findFilm(filmObj){
    var source = $("#entry-template").html();
    var template = Handlebars.compile(source);

    var resultsFilm = filmObj.results;

    for (var i = 0; i < resultsFilm.length; i++){
      var singleFilm = resultsFilm[i];
      var html = template(singleFilm);
      $('.filmsList').append(html);
    }
  }

});
