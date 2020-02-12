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
    search();
  });
  $('.film-input').keypress(function(event){
    if(event.which == 13){
      search();
    }
  });
  mouseOnDetails();

  // FUNZIONI

  function search(){
    var input = $('.film-input').val();
    var api_key = '1fedcc210c1f6d12a58971ab67657552';
    var filmUrl = 'https://api.themoviedb.org/3/search/movie';
    var tvUrl = 'https://api.themoviedb.org/3/search/tv';
    var filmType = 'film';
    var tvType = 'tv';
    showTypeOnSearch();
    getData(input, api_key, filmUrl, filmType);
    getData(input, api_key, tvUrl, tvType);
    clearResults();
  }

  // funzione messaggio nessun risultato

  function noResultsMsg(type, keyword){
    var source = $("#no-results-template").html();
    var template = Handlebars.compile(source);
    var msg = {
      message: 'Nessun risultato trovato in ' + type + ' per: ' + '"' + keyword + '"'
    };
    var html = template(msg);
    if (type == 'film'){
      $('.films-list').append(html);
    } else if (type == 'tv'){
      $('.tv-series-list').append(html);
    }
  }

  // funzione chiamata api per ricevere risultati film e serie tv in base alla ricerca

  function getData(keyword, api_key, url, type){
    $.ajax({
      url: url,
      method: 'GET',
      data: {
        api_key: api_key,
        query: keyword,
        language: 'it-IT'
      },
      success: function(data){
        if (data.total_results > 0){
          findFilmTv(type, data);
        } else {
          noResultsMsg(type, keyword);
        }
      },
      error: function(request, state, errors){
        alert("C'è stato un problema " + errors);
      }
    });
  }

  // funzione per prendere tutti i film dalla chiamata

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
    noImg();
    noOverview();
  }

  // funzione per pulire le liste delle serie in seguito a una nuova ricerca

  function clearResults(){
    $('.container .films-list').html('');
    $('.container .tv-series-list').html('');
    $('.film-input').val('');
  }

  // cambio di voto da 10 a 5

  function voteFrom10To5(){
    $('.vote').each(function(){
      var singleVote = $(this).text();
      var singleVoteOn5 = Math.ceil(singleVote / 2);
      $(this).html(formVoteToStarsCicle(singleVoteOn5));
    });
  }

  // funzione per cambiare valutazione da voti a stelle

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

  // funzione per cambiare sigla lingua in bandiera

  // function fromLangToFlag(){
  //   $('.lang').each(function(){
  //     var singleLang = $(this).text();
  //     var lang = $(this);
  //     if (singleLang == 'it'){
  //       lang.html('<img src="img/italy.png" alt="IT">');
  //     } else if (singleLang == 'en'){
  //       lang.html('<img src="img/uk.png" alt="EN">');
  //     } else if (singleLang == 'fr'){
  //       lang.html('<img src="img/france.png" alt="FR">');
  //     } else if (singleLang == 'es'){
  //       lang.html('<img src="img/spain.png" alt="SP">');
  //     } else if (singleLang == 'de'){
  //       lang.html('<img src="img/germany.png" alt="DE">');
  //     }
  //   });
  // }

  function fromLangToFlag(){
    var availableLangs = [
      'it',
      'en',
      'fr',
      'es',
      'de'
    ];
    $('.lang').each(function(){
      var singleLang = $(this).text();
      if (availableLangs.includes(singleLang)){
        $(this).html('<img src="img/' + singleLang + '.png" alt="IT">');
      }
    });
  }

  // funzione che inserisce immagine di default dove non trova immagini di copertina

  function noImg(){
    $('.cover-img').each(function(){
      var thisCover = $(this).attr('src');
      if (thisCover == "https://image.tmdb.org/t/p/w342"){
        $(this).attr('src','img/nocover.png');
      }
    });
  }

  function noOverview(){
    $('.overview').each(function(){
      var thisOverview = $(this).text();
      if (thisOverview == ''){
        $(this).text('Overview non disponibile');
      }
    });
  }

  // funzione che mostra i dettagli del film passando sopra con il mouse

  function mouseOnDetails(){
    $(document).on('mouseenter', '.film-template', function(){
      var thisFilm = $(this);
      thisFilm.find('.details').toggleClass('display-none');
    });
    $(document).on('mouseleave', '.film-template', function(){
      var thisFilm = $(this);
      thisFilm.find('.details').toggleClass('display-none');
    });
  }

  // funzione che mostra scritte alla ricerca

  function showTypeOnSearch(){
    $('.type-title').removeClass('display-none');
  }

});
