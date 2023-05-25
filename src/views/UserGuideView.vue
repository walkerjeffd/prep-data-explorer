<template>
  <v-img
    class="bg-white prep-splash"
    width="100%"
    :aspect-ratio="2.5"
    src="/img/Monkman_NHSCS_D32617_2400.jpg"
    cover
  ></v-img>
  <div class="d-flex justify-center">
    <v-container style="position:absolute;top:100px" fluid>
      <v-row class="justify-center">
        <v-col cols="12" lg="12" xl="8">
          <v-sheet elevation="8" class="px-12 pt-16 pb-8 prep-hero">
            <h1 class="text-h3">User Guide</h1>

            <v-divider class="mb-8"></v-divider>

            <v-alert type="warning" title="Work in Progress" variant="tonal" border="start" class="my-8">
              <div class="font-weight-bold">This user guide is currently under development. Please check back soon for updates.</div>
            </v-alert>

            <div class="text-h5">Getting Started</div>
            <ul class="ml-8 text-body-1">
              <li>To begin exploring data in the web application, navigate to the EXPLORER tabs in the top banner above.</li>
              <li>Upon opening the tab, you will find the main page of the Data Explorer that includes an interactive map on the left showing the locations of stations in the database along with a side panel on the right containing a FILTER STATIONS tab with fields for filtering the data.</li>
              <li>The side panel also includes a COMPARE tab that allows you to visually compare different datasets selected from the database.</li>
              <li>Upon selecting a station on the map, you can visualize the data through the SELECTED STATION DATA pop-up in the bottom left corner of the page.</li>
            </ul>

            <div class="text-h5 mt-8">Interactive Map</div>
            <ul class="ml-8 text-body-1">
              <li>To navigate through the interactive map, click and drag your cursor on the map or click the map and use the arrows on your keyboard to move around.</li>
              <li>To zoom in and out, use the buttons in the top left corner of the map or the appropriate buttons and/or commands on your mouse or trackpad.</li>
              <li>To select a station, click on any one of the stations displayed on the map. Selected stations are shown in orange. For locations with a high density of stations, multiple stations may be selected with a single click.</li>
              <li>Stations on the map are colored according to the number of values per station, with the corresponding color bar located in the top right corner of the map. Darker colors indicate stations with fewer values while brighter colors indicate stations with many values. Note that the values in the color bar are displayed by percentile rather than linearly.</li>
              <li>To change the base map or add spatial layers on the interactive map, hover over the layer symbol  in the top left corner of the map and click on the items that you wish to add.</li>
              <li>Scalebars showing distances in both metric and imperial units are located in the bottom right corner of the map.</li>
            </ul>

            <div class="text-h5 mt-8">Filter Stations</div>
            <ul class="ml-8 text-body-1">
              <li>Data from the database can be filtered by multiple metrics, including Start Date, End Date, Parameters, and Number of Values per Station. As filters are applied, the map will dynamically update to display the relevant filtered results. Note: more filter metrics (such as sample medium, parameter grouping, and spatial areas) are currently in development!</li>
              <li>To filter stations by sample date, select a Start Date and/or and End Date. Values can be entered into these fields either manually or by using the calendar dropdown menus.</li>
              <li>To filter by Parameter, select one or more values from the dropdown menu or search for a specific parameter by clicking the field and entering text. In total, there are 455 different Parameters to choose from.</li>
              <li>To filter by Number of Values per Station, use the two buttons on the slide bar to select a minimum and maximum number of values for the stations. Note that the number of values shown on the bar are dynamically updated as the data are filtered and are displayed by percentile rather than linearly.</li>
              <li>The number of stations actively being shown on the map is listed below the Number of Values per Station slide bar.</li>
              <li>To reset any filters applied to the data, click the RESET button in the bottom left corner of the right side panel.</li>
            </ul>

            <div class="text-h5 mt-8">Selected Station Data</div>
            <ul class="ml-8 text-body-1">
              <li>Once a station is selected from the interactive map, the corresponding data from that station will appear in the SELECTED STATION DATA pop-up in the bottom left corner of the page.</li>
              <li>To clear the selected station from the SELECTED STATION DATA pop-up, click on the X in the top right corner of the pop-up window.</li>
              <li>To expand or collapse the SELECTED STATION DATA pop-up, click on the arrow in the top right corner of the pop-up window.</li>
              <li>To expand the SELECTED STATION DATA pop-up to the full screen, click on the four-corner arrow symbol in the top right corner of the pop-up window.</li>
              <li>Metadata for the selected station are displayed below the Station ID shown at the top of the pop-up window. Metadata include the Station Description, Waterbody ID, Waterbody Description, Station Alias, Station Type, and Latitude/Longitude.</li>
              <li>To change the parameter being viewed on the figure, select one or more values from the dropdown menu within the Select Parameter field or search for a specific parameter by clicking the field and entering text.</li>
              <li>To zoom in on the figure, click and drag a zoom area within the figure to select the desired data range.</li>
              <li>To return to the default figure zoom, select the Reset Zoom button in the top right corner of the figure once it appears.</li>
              <li>To compare the data currently being viewed in the figure with other data, click the ADD TO COMPARE button in the bottom left corner of the pop-up window. This will add the timeseries to the display shown in the COMPARE tab in the right side panel.</li>
            </ul>

            <div class="text-h5 mt-8">Downloading</div>
            <ul class="ml-8 text-body-1">
              <li>Once data has been added to the COMPARE tab, the data are displayed graphically in the figure within the right side panel. A summary of each timeseries plotted in the COMPARE figure is shown in a table below the figure and includes information such as Station ID, Parameter, Period, and Number of Values.</li>
              <li>There is no limit to the number of timeseries that can be added to the COMPARE figure.</li>
              <li>To remove a single timeseries from the COMPARE tab, click the X on the right side of the row corresponding to that timeseries in the table.</li>
              <li>To remove all timeseries from the COMPARE tab, click the CLEAR button in the bottom left corner of the side panel.</li>
              <li>To toggle timeseries display in the COMPARE tab on and off in the figure, click the corresponding name in the legend below the figure.</li>
              <li>If more than 12 timeseries are added to the figure, use the arrows below the figure legend to view the ones that are not shown at the top of the legend.</li>
              <li>To zoom in on the figure, click and drag a zoom area within the figure to select the desired data range.</li>
              <li>To return to the default figure zoom, select the Reset Zoom button in the top right corner of the figure.</li>
            </ul>

            <div class="text-h5 mt-8">Compare</div>
            <ul class="ml-8 text-body-1">
              <li>Data can be downloaded from three different locations in the web application: the FILTER STATIONS tab, the COMPARE tab, and the SELECTED STATION DATA pop-up.</li>
              <li>All download options produce CSV files that are labeled by download date and time. Columns in the download file include Station ID, Station Code, Station Name, Variable, Units,  Datetime, and Value.</li>
              <li>To download data from the FILTER STATIONS tab, select the filters that you wish to apply to the data and then click the BULK DOWNLOAD button in the bottom right corner of the side panel. This will download the data for all stations shown in the interactive map for the parameters selected in the FILTER STATIONS tab.</li>
              <li>If the BULK DOWNLOAD button is greyed out, the data selection is too large to download. The maximum number of data points that can be downloaded is one million. To proceed with downloading, filter down the data to a smaller size and try again.</li>
              <li>To download data from the COMPARE tab, click the DOWNLOAD button in the bottom right corner of the side panel. This option will download all timeseries that are present in the COMPARE tab, not just those that are displayed on the map.</li>
              <li>To download data from the SELECTED STATION DATA pop-up, make sure that the timeseries that you wish to download is displayed on the figure in the pop-up and click the DOWNLOAD button in the bottom right corner.</li>
            </ul>

            <v-divider class="my-8"></v-divider>

            <div class="d-flex justify-space-around">
              <v-btn :to="{name: 'home'}" color="accent" size="large" variant="outlined">
                <v-icon icon="mdi-arrow-left" start></v-icon> Back to Home
              </v-btn>
              <v-btn :to="{name: 'explorer'}" color="accent" size="large">
                Open Explorer <v-icon icon="mdi-arrow-right" end></v-icon>
              </v-btn>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
li {
  font-size: larger;
  margin-top: 8px;
}
</style>
