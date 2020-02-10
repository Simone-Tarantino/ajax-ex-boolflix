// Titolo "title"
// Titolo Originale "original_title"
// Lingua "original_language"
// Voto "vote_average"

// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da
// permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5,
// lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze
// piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della
// nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della
// nazione ritornata dall’API (le flag non ci sono in FontAwesome).
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca
// dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando
// attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di
// risposta diversi, simili ma non sempre identici)

$(document).ready(function(){
  $('.search-film').click(function(){
    var input = $('.film-input').val();
    clearResults();
    getFilms(input);
    getTvShows(input);
  });



  function noResultsMsg(type){
    var source = $("#no-results-template").html();
    var template = Handlebars.compile(source);
    var inputVal = $('.film-input').val();
    var msg = {
      message: 'Nessun risultato trovato in' + type + 'per: ' + '"' + inputVal + '"'
    };
    var html = template(msg);
    $('.filmsList').append(html);
  }

  function getFilms(keyword){
    $.ajax({
      url: 'https://api.themoviedb.org/3/search/movie',
      method: 'GET',
      data: {
        api_key: '1fedcc210c1f6d12a58971ab67657552',
        query: keyword,
        language: 'it-IT'
      },
      success: function(data){
        var type = 'film';
        if (data.total_results > 0){
          findFilmTv(type, data);
        } else {
          noResultsMsg(type);
        }
      },
      error: function(request, state, errors){
        alert("C'è stato un problema " + errors);
      }
    });
  }

  function getTvShows(keyword){
    $.ajax({
      url: 'https://api.themoviedb.org/3/search/tv',
      method: 'GET',
      data: {
        api_key: '1fedcc210c1f6d12a58971ab67657552',
        query: keyword,
        language: 'it-IT'
      },
      success: function(data){
        var type = 'tv';
        if (data.total_results > 0){
          findFilmTv(type, data);
        } else {
          noResultsMsg(type);
        }
      },
      error: function(request, state, errors){
        alert("C'è stato un problema " + errors);
      }
    });
  }

  function findFilmTv(type, filmObj){
    var source = $("#entry-template").html();
    var template = Handlebars.compile(source);
    var resultsFilm = filmObj.results;
    for (var i = 0; i < resultsFilm.length; i++){
      var singleFilm = resultsFilm[i];
      var html = template(singleFilm);
      if (type == 'film'){
        $('.films-list').append(html);
      } else if (type == 'tv'){
        $('.tv-series-list').append(html);
      }
    }
    fromLangToFlag();
    voteFrom10To5();
  }

  function clearResults(){
    $('.container .films-list').html('');
    $('.container .tv-series-list').html('');
    $('.film-input').val('');
  }


  function voteFrom10To5(){
    $('.vote').each(function(){
      var singleVote = $(this).text();
      var singleVoteOn5 = Math.ceil(singleVote / 2);
      $(this).html(formVoteToStarsCicle(singleVoteOn5));
    });
  }

  function formVoteToStarsCicle(vote){
    var star = '<i class="fas fa-star"></i>';
    var totStars = star;
    if (vote != 0){
      for (var i = 2; i <= vote; i++){
        totStars += star;
      }
    } else {
      totStars = 'S.V.';
    }
    return totStars;
  }

  function fromLangToFlag(){
    $('.lang').each(function(){
      var singleLang = $(this).text();
      var lang = $(this);
      if (singleLang == 'it'){
        lang.html('<img src="img/italy.png" alt="IT">');
      } else if (singleLang == 'en'){
        lang.html('<img src="img/uk.png" alt="EN">');
      } else if (singleLang == 'fr'){
        lang.html('<img src="img/france.png" alt="FR">');
      } else if (singleLang == 'es'){
        lang.html('<img src="img/spain.png" alt="SP">');
      } else if (singleLang == 'de'){
        lang.html('<img src="img/germany.png" alt="DE">');
      }
    });
  }



});
