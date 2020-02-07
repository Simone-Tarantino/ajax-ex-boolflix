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
  $(document).on('click', '.search-film', function(){
    var inputFilm = $('.film-input').val();
    $.ajax({
      url: 'https://api.themoviedb.org/3/search/movie',
      method: 'GET',
      data: {
        api_key: '1fedcc210c1f6d12a58971ab67657552',
        query: inputFilm,
        language: 'it-IT'
      },
      success: function(data){
        if (data.total_results > 0){
          clearResults();
          findFilm(data);
          clearInput();
        } else {
          clearResults();
          noResultsMsg();
          clearInput();
        }
      },
      error: function(request, state, errors){
        alert("C'è stato un problema " + errors);
      }
    });
  });

  function noResultsMsg(){
    var source = $("#no-results-template").html();
    var template = Handlebars.compile(source);
    var inputVal = $('.film-input').val();
    var msg = {
      message: 'Nessun risultato trovato per: ' + "'" + inputVal + "'"
    };
    var html = template(msg);
    $('.filmsList').append(html);
  }


  function findFilm(filmObj){
    var source = $("#entry-template").html();
    var template = Handlebars.compile(source);

    var resultsFilm = filmObj.results;

    for (var i = 0; i < resultsFilm.length; i++){
      var singleFilm = resultsFilm[i];
      var html = template(singleFilm);
      $('.filmsList').append(html);
    }
    fromLangToFlag();
    voteFrom10To5();
  }

  function clearResults(){
    $('.filmsList .film-template').hide();
  }

  function clearInput(){
    $('.film-input').val('');
  }

  function voteFrom10To5(){
    $('.vote').each(function(){
      var singleVote = $(this).text();
      console.log('voto originale ' + singleVote);
      var singleVoteOn5 = Math.ceil(singleVote / 2);
      console.log('voto su 5: ' + singleVoteOn5);
      $(this).html(fromVoteToStars(singleVoteOn5));
    });
  }

  function fromVoteToStars(vote){
    var stars;
    if (vote == 1){
      stars = '<i class="fas fa-star"></i>';
    } else if (vote == 2){
      stars = '<i class="fas fa-star"></i> <i class="fas fa-star"></i>';
    } else if (vote == 3){
      stars = '<i class="fas fa-star"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i>';
    } else if (vote == 4){
      stars = '<i class="fas fa-star"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i>';
    } else if (vote == 5){
      stars = '<i class="fas fa-star"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i>';
    } else {
      stars = 'S.V';
    }
    return stars;
  }

  function fromLangToFlag(){
    $('.lang').each(function(){
      var singleLang = $(this).text();
      var lang = $(this);
      console.log(singleLang);
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
