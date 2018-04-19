
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

            map.dataProvider = dataProvider;
            addCity();
            cityDropdown();
            addProvider();

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
                  city.svgPath = targetSVG;
                  city.zoomLevel = 5;
                  city.scale = 0.5;
                  city.chart = map;
                map.dataProvider.images.push( city );
             } // end for loop
        } // end addCity

        // Add Provider dataProvider
        function addProvider (){
            for (var x in providers){
                var provider = new AmCharts.MapImage();
                    provider.type = 'circle';
                    provider.width = providers[x].population;
                    provider.height = providers[x].population;
                    provider.county = providers[x].name;
                    provider.latitude = providers[x].lat;
                    provider.longitude = providers[x].long;
                    provider.population = providers[x].population;
                    provider.color = '#3a8cae';
                    provider.svgPath = targetSVG;
                    provider.chart = map;
                    map.dataProvider.images.push(provider);
            }
        }

        // Populating Dropdown with all Cities
        function cityDropdown (){
            var select = document.getElementById( 'citiesSelect' );
            for ( var x in cities ) {
              var option = document.createElement( 'option' );
              option.value = x;
              option.text = cities[ x ].city + ', '+ cities[ x ].state_id ;
              select.appendChild( option );
          } // end for loop
        } // end cityDropdown

        function citySelected(){
            var selectBox = document.getElementById("citiesSelect");
            var selectedValue = parseInt(selectBox.options[selectBox.selectedIndex ].value) + 1;
            var selectedImg =  map.dataProvider.images[selectedValue];
            var selectedImgZoom =  selectedImg.zoomLevel;
            var selectedImgLat =  selectedImg.latitude;
            var selectedImgLong =  selectedImg.longitude;

            map.zoomToLongLat(selectedImgZoom, selectedImgLong, selectedImgLat, true);
        }
