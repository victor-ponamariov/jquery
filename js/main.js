$(document).ready( function() {

    let $carImg = $('#imgHolder img');

    $('#colorsSelector .colorItem').on('click', function() {
        let imagePath = $(this).attr('data-image-path');
        $carImg.fadeOut(200, function() {
            $carImg.attr('src', imagePath).fadeIn(200);
        });
    });

    let modelSpecs,
        modelPrice,
        modelSpecsHolder,
        modelPriceUSDHolder,
        modelPriceHolder;

    let $modelSpecsHolder = $('#modelSpecs');
    let $modelPriceHolder = $('#modelPrice');
    let $modelPriceUSDHolder = $('#modelPriceUSD');

    function calculatePrice() {
        
        let $modelPriceEngine = +$('input[name=engine]:checked', '#auto-form').val();
        let $modelPriceTransmission = +$('input[name=transmission]:checked', '#auto-form').val();
        let $modelPricePackage = +$('input[name=package]:checked', '#auto-form').val();

        modelPrice = $modelPriceEngine + $modelPriceTransmission + $modelPricePackage;

        $modelPriceHolder.text(addSpaces(modelPrice) + ' рублей');
    }

    function compileSpecs() {
        $modelSpecs = $('input[name=engine]:checked + label', '#auto-form').text();
        $modelSpecs += ', ' + $('input[name=transmission]:checked + label', '#auto-form').text();
        $modelSpecs += ', ' + $('input[name=package]:checked + label', '#auto-form').text() + '.';
        $modelSpecsHolder.text($modelSpecs);

    }

    // При старте страницы
    calculatePrice();
    compileSpecs();
    

    $('#auto-form input').on('change', function(){
        calculatePrice();
        compileSpecs();
        calculateUSD();
    })

    function addSpaces(nStr) {
        nStr += "";
        x = nStr.split(".");
        x1 = x[0];
        x2 = x.length > 1 ? "." + x[1] : "";
        var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, "$1" + " " + "$2");
            }
        return x1 + x2;
    }

    let currencyUrl = 'https://www.cbr-xml-daily.ru/daily_json.js';

    let rurUsdRate = 0;

    $.ajax ({
        url: currencyUrl,
        cache: false,
        dataType: 'json',
        success: function(html) {
            rurUsdRate = html.Valute.USD.Value;
            calculateUSD();
        }
    });

    function calculateUSD() {
        let modelPriceUSD = modelPrice / rurUsdRate;
        $modelPriceUSDHolder.text('$ ' + addSpaces(modelPriceUSD.toFixed(0)));
    } 


});