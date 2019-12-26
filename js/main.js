$(document).ready( function() {
  // Во всех файлах я сделал отступы по 2 пробела, это уже общепринято, потому что
  // HTML код тянется просто пипец как, да и JS/CSS. Просто лучше 2 символа, так делают гораздо чаще

  // Здесь вероятно можно прям на img повесить id? <img id="carImg"> вместо того чтоб длинный селект использовать
  // $('#carImg') например.
  let $carImg = $('#imgHolder img');

  $('#colorsSelector .colorItem').on('click', function() {
    let imagePath = $(this).attr('data-image-path');

    $carImg.fadeOut(200, function() {
      $carImg.attr('src', imagePath).fadeIn(200);
    });
  });

  // Удалил ненужные переменные
  let modelPrice;

  let $modelSpecsHolder = $('#modelSpecs');
  let $modelPriceHolder = $('#modelPrice');
  let $modelPriceUSDHolder = $('#modelPriceUSD');

  function calculatePrice() {
    // Есть разные способы приведения к инту, я + не люблю, я parseInt юзаю, а щас загуглил
    // и самый норм метод типа Number(..). Но на вкус и цвет) Просто считаю что + не понятен
    // если человек допустим на другом языке кодит, то parseInt он поймет, а плюс - нет.
    // Но это не ошибка, норм, просто комментарии
    let $modelPriceEngine = +$('input[name=engine]:checked', '#auto-form').val();
    let $modelPriceTransmission = +$('input[name=transmission]:checked', '#auto-form').val();
    let $modelPricePackage = +$('input[name=package]:checked', '#auto-form').val();

    modelPrice = $modelPriceEngine + $modelPriceTransmission + $modelPricePackage;

    $modelPriceHolder.text(addSpaces(modelPrice) + ' рублей');
  }

  function compileSpecs() {
    // Здесь ты забыла let, IDE ругается. То есть поидее это глобальные переменные, или хз
    // но нужен let палюбас
    let $modelSpecs = $('input[name=engine]:checked + label', '#auto-form').text();
    $modelSpecs += ', ' + $('input[name=transmission]:checked + label', '#auto-form').text();
    $modelSpecs += ', ' + $('input[name=package]:checked + label', '#auto-form').text() + '.';

    // Вообщем от таких jquery конструкций меня уже воротит, то есть, наверняка можно как-то лучше
    // написать, но jquery сам по себе такой =(

    $modelSpecsHolder.text($modelSpecs);
  }

  // При старте страницы
  calculatePrice();
  compileSpecs();

  $('#auto-form input').on('change', function(){
    calculatePrice();
    compileSpecs();
    calculateUSD();
  });

  // Это я так понимаю ты откуда то копирнула, но все же let проставить хоть
  function addSpaces(nStr) {
    nStr += "";
    let x = nStr.split(".");
    let x1 = x[0];
    let x2 = x.length > 1 ? "." + x[1] : "";
    let rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + " " + "$2");
    }

    return x1 + x2;
  }

  let currencyUrl = 'https://www.cbr-xml-daily.ru/daily_json.js';

  let rurUsdRate = 0;

  $.ajax({
    url: currencyUrl,
    cache: false,
    dataType: 'json',
    // не html, ты получаешь какие то данные, слово html здесь не уместно
    success: function(data) {
      rurUsdRate = data.Valute.USD.Value;
      calculateUSD();
    }
  });

  function calculateUSD() {
    let modelPriceUSD = modelPrice / rurUsdRate;
    $modelPriceUSDHolder.text('$ ' + addSpaces(modelPriceUSD.toFixed(0)));
  }
});
