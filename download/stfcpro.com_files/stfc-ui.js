let STFCUI;
STFCUI = (function() {
    //helpers
    let systemNames = []; //holds all the system names for typeahead (simple array with just the names)
    let cleanedNames = []; //holds all the system names for typeahead (simple array with just the names)
    let systemTokens = []; //holds system names in a tag format for typeahead (typeahead tags formatted object)

    let init = function(map) {
        console.log("STFCUI init");
        //initFlyToSystem();
        //initBringNearSystem();
        //initClearPathsFromSystem();
        map.addControl(new systemSearchTool());
        initTypeaheadB();
    };

    let systemSearchTool = L.Control.extend({
        options: {
            position: 'topleft'
            //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
        },
        onAdd: function(map) {
            let container = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom');
            container.innerHTML =
                `<div id="search-tool">
                  <input type="text" class="typeahead" id="search-input" name="search" placeholder="Search Systems">
                  <button id="search-submit" type="submit" class="btn btn-search">
                    <i class="fa fa-search"></i>
                  </button>
                  <button id="search-reset" type="reset" class="btn btn-reset fa fa-times"></button>
                </div>`;
            let _searchWrapper = $("#search-tool", container);
            let _input = $("#search-input", container);
            let _submit = $("#search-submit", container);
            let _reset = $("#search-reset", container);

            _submit.on("click", function(){
                if(!_searchWrapper.hasClass("focus")){
                    _searchWrapper.addClass("focus");
                    _input.select();
                }else{
                    submit();
                }
            });

            //override close on losing focus
            _input.bind('typeahead:beforeclose',
                function (e) {
                    e.preventDefault();
                }
            );
            /*_input.bind('typeahead:change',
                function (e,i) {
                    e.preventDefault();
                    console.log("changed", e,i);
                }
            );*/
            /*_input.bind('typeahead:selected', function(e,i) {
                // do what you want with the item here
                console.log("selected", e,i);
            })*/

            _input.on("click", function(){
                $(this).focus();
                _searchWrapper.addClass("focus");
                console.log("input focused");
                if(_input.val() !== ''){
                    _input.select();
                }
            });

            _input.on("focusout", function(e){
                console.log("input losing focus:", e, $(".typeahead").typeahead("val"));
                if($(".typeahead").typeahead("val") === ''){
                    //_input
                    _searchWrapper.removeClass("focus");
                    console.log("input lost focus");
                }
            });
            _reset.on("click", function(){
                if(_input.val() === ""){
                    _searchWrapper.removeClass("focus");
                    console.log("input empty, no reset");
                }else{
                    _input.val("");
                    console.log("input reset");
                }
            });
            function submit(){
                cleanedNames = STFCMap.getCleanedNames();
                let name = _input.val();
                let cleaned = STFCMap.cleanName(name);
                if(cleanedNames.indexOf(cleaned) >= 0){
                    STFCMap.flyToSystem(cleaned, true);
                }
                _searchWrapper.removeClass("focus");
                _input.typeahead('val', '');
            }
            return container;
        },
    });

    let initTypeaheadB = function(){
        systemNames = STFCMap.getSystemNames();
        let sysNames = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: systemNames
        });
        sysNames.initialize();

        $(".typeahead").typeahead({
            minLength: 1,
            hint: true,
            highlight: true
        }, {
            name: 'systems',
            source: sysNames.ttAdapter()
        })
            .on('typeahead:opened', onOpened)
            .on('typeahead:selected', onSelected)
            .on('typeahead:checked', onChecked)
            .on('typeahead:autocompleted', onAutocompleted);

    };

    function onOpened($e) {
        //console.log('opened');
    }
    function onChecked(e, i) {
        //console.log('checked', e, i);
    }

    function onAutocompleted($e, datum) {
        //console.log('autocompleted', datum);
    }

    function onSelected($e, datum) {
        console.log('selected', $e, datum);
        $(".tt-menu").css("display", "none");
        $("#search-submit").trigger('click');
    }

    let closeSuggestions = function(){

    };

    let substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            let matches, substringRegex;
            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            let substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
            });

            cb(matches);
        };
    };

    return { // public interface
        init: function(map) {
            init(map);
        }
    };
})();