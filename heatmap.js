$(function() {
    console.log( "ready!" );

    // Find the id of the selected state dropdown
    $("#statesSelect").change(function() {
        var id = $(this).children(":selected").attr("id");
        cityDropdown(id);
    });

});

    // svg path for target icon
    var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

    AmCharts.ready(function() {
        var select = document.getElementById( 'cities' );
        map = new AmCharts.AmMap();


        var dataProvider = {
            mapVar: AmCharts.maps.usa2Low,
            images: []
        }; // end dataProvider

        map.areasSettings = {
            autoZoom: true
        };

        map.addClassNames = {
            addClassNames: true
        };

        map.dataProvider = dataProvider;
        addCity();
        industriesDropdown();

        map.write("mapdiv");
        map.currentZoom = {
           "zoomLevel": map.zoomLevel(),
           "zoomLongitude": map.zoomLongitude(),
           "zoomLatitude": map.zoomLatitude()
       };
    }); // end AmCharts.ready

    // Add Cities to the Map
    function addCity (){
        for ( var x in cities ) {
            var city = new AmCharts.MapImage();
              city.title = cities[x].city;
              city.latitude = cities[x].lat;
              city.longitude = cities[x].lng;
              city.countyFips = cities[x].county_fips;
              city.svgPath = targetSVG;
              city.zoomLevel = 5;
              city.scale = 0.5;
              city.chart = map;
            map.dataProvider.images.push( city );
         } // end for loop
    } // end addCity

    // Add Provider dataProvider
    function addProvider(){
        for (var x in providers.categories){
            var industrySelected = $('#industiesSelect').children(":selected").attr("value");
            var industryName = providers.categories[x].type_of_work_name;
            var industryInfo = providers.categories[x];
            var industryCounties = industryInfo.counties;
            if(industrySelected == industryName){
                for(var y in counties){
                    if(counties[y].population > 0){
                        console.log('in industry county providers > 0');
                        var provider = new AmCharts.MapImage();
                        provider.type = 'circle';
                        provider.alpha = '0.2';
                        provider.color = '#F16522';
                        provider.borderColor = '#cb4727';
                        provider.borderAlpha = '0.2';
                        provider.svgPath = targetSVG;
                        provider.chart = map;
                        provider.fixedSize = true;
                        provider.latitude = counties[y].lat;
                        provider.longitude = counties[y].long;
                        provider.width = counties[y].population;
                        provider.height = industryCounties[y].population;
                        map.dataProvider.images.push(provider);
                        console.log('map.dataProvider.images',  map.dataProvider.images);

                        // provider.title = '<strong>' + industryCounties[y].county + '</strong> </br> <strong>Providers: </strong>' +  industryCounties[y].providers;
                        //

                        // provider.county = industryCounties[y].county + ' County';
                        // // provider.latitude = providers[y].lat;
                        // // provider.longitude = providers[y].long;
                        // provider.population = industryCounties[y].providers;

                    }
                }
            }
        }
    }

    // Populating Industries Dropdown
    function industriesDropdown(){
        var select = document.getElementById( 'industiesSelect' );
        for ( var x in providers.categories ) {
          var category = providers.categories;
          var option = document.createElement( 'option' );
          option.value = category[ x ].type_of_work_name;
          option.text = category[ x ].type_of_work_name;
          select.appendChild( option );
      } // end for loop

  } // end industriesDropdown

    function statesDropdown (){
        var select = document.getElementById( 'statesSelect' );
        for ( var x in states ) {
          var option = document.createElement( 'option' );
          var stateName = states[ x ].state_name;
          var stateId = states[ x ].state_id;
          option.id = stateId;
          option.value = stateId;
          option.text = stateName;
          select.appendChild( option );
        } // end for loop
    } // end stateDropdown

    // Populating Dropdown with all Cities
    function cityDropdown (stateId){
        console.log('in cityDropdown with', stateId);
        // Removing All Cities Options
        $('#citiesSelect')
        .find('option')
        .remove()
        .end()
        .append('<option value="">- Select a City - </option>');

        var select = document.getElementById( 'citiesSelect' );
        for ( var x in cities ) {
            if(cities[x].state_id == stateId) {
                var option = document.createElement( 'option' );
                option.value = cities[ x ].county_fips;
                option.text = cities[ x ].city + ', '+ cities[ x ].state_id ;
                select.appendChild( option );
            }
      } // end for loop
    } // end cityDropdown

    function industrySelected (){
        addProvider();
        statesDropdown();
    }

    function citySelected(){
        var selectBox = document.getElementById("citiesSelect");
        var selectedValue = selectBox.options[selectBox.selectedIndex ].value;

        // Match selected city with matching img by countyFips value
        function selectedImage(selectedValue){
            for (var i = 0; i < map.dataProvider.images.length; i++) {
                var selectedImg = map.dataProvider.images[i];
                var countyFips = selectedImg.countyFips;
                if (countyFips == selectedValue){
                    var selectedImgZoom =  selectedImg.zoomLevel;
                    var selectedImgLat =  selectedImg.latitude;
                    var selectedImgLong =  selectedImg.longitude;
                    map.zoomToLongLat(selectedImgZoom, selectedImgLong, selectedImgLat, true);
                    return;
                }
            }
        }

        selectedImage(selectedValue);
    }
