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
          <v-sheet elevation="8" class="px-12 pt-16 pb-8 prep-hero text-body-1">
            <h1 class="text-h3">User Guide</h1>
            <v-divider class="mb-8"></v-divider>

            <v-row class="align-center justify-center">
              <v-col cols="3" class="text-center">
                <a download href="/pdf/Piscataqua_Watershed_Data_Explorer_User_Guide.pdf" class="pb-0 mx-auto">
                  <v-img src="/img/user-guide-cover.png" class="elevation-2 my-2 mx-auto" style="border-radius:10px;" width="300"></v-img>
                </a>
              </v-col>
              <v-col cols="5">
                <div class="mb-8 text-h6">
                  The User Guide provides detailed instructions on how to filter, visualize, and download data. 
                </div>
                <v-btn color="accent" size="large" download href="/pdf/Piscataqua_Watershed_Data_Explorer_User_Guide.pdf">
                  <v-icon icon="mdi-download" start></v-icon> Download User Guide (PDF)
                </v-btn>
              </v-col>
            </v-row>

            
            <h1 class="text-h3 mt-12">Frequently Asked Questions</h1>
            <v-divider class="mb-8"></v-divider>
            
            <v-row>
              <v-col cols="12">
                <v-expansion-panels>
                  <v-expansion-panel
                    title="How do I view data?"
                  >
                    <template #text>
                      To visualize data, click on any station shown on the map and the <strong>Selected Station Data</strong> pop-up will open with a timeseries plot showing data at your selected station. By default, the plot will show all data for the first parameter in alphabetical order at that station. If you have already selected a time period and/or parameters of interest in the <code>FILTERS</code> tab, the plot will initially show data within that time period for the first parameter you selected.
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I filter data for a specific time period?"
                  >
                    <template #text>
                      To filter data by date, type in values or use the calendar drop-down menus to enter start and end dates for the time interval you are interested in for the two fields in the Time Period section of the <code>FILTERS</code> tab. The map will automatically update to show only the stations that have data for your selected time interval.
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="Aren't there more data than what is first displayed when you open the Explorer?"
                  >
                    <template #text>
                      Yes, there are more data than what is available when you first open the Explorer. In fact, there's so much data that to prevent data overload we decided to display only the <strong>core stations</strong> initially. To reveal the data from all stations in the watershed, toggle the <strong>Core stations only</strong> button off in the Stations section of the <code>FILTERS</code> tab.
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="If I know the names of the stations I am interested in, is there a way I can access data from those stations directly?"
                  >
                    <template #text>
                      To filter data by station, type in the names or use the drop-down menu to select the stations you are interested in for the <strong>Select station(s)</strong> field in the <strong>Stations</strong> section of the <code>FILTERS</code> tab. The map will automatically update to show only the stations that you have selected.
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="Can I filter data based on geographic area (e.g., watershed, waterbody, municipal boundary, etc.)?"
                  >
                    <template #text>
                      Yes, you can filter data by geographic area by adding spatial data layers to the map and clicking on specific features within those data layers. To add spatial data layers, open the drop-down menu in the Map Layers section of the map legend and click on the desired layer names. Layers that can be used for filtering are identified by the filter icon next to their name.
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I filter data for specific parameters (e.g., temperature, dissolved oxygen, chlorophyll-a)?"
                  >
                    <template #text>
                      To filter data by parameter, type in the name or use the drop-down menu to select the parameters you are interested in for the <strong>Select parameter(s)</strong> field in the Parameters section of the <code>FILTERS</code> tab. The map will automatically update to show only the stations with data for the parameter you selected.
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="Aren't there more parameters than what is shown in the 'Select parameter(s)' drop-down menu?"
                  >
                    <template #text>
                    Yes, there are more parameters than what is shown initially when you first open the <strong>Select parameter(s)</strong> drop-down menu. In fact, there are more than 175 different parameters to select from in the database. Many of these variables, however, are specific chemicals or analyses that are only relevant for narrowly focused research efforts. To simplify the parameter list for users, we created a list of <strong>Core Parameters</strong> that represent the variables that are most used by researchers. To reveal the complete list of parameters in the <strong>Select parameter(s)</strong> drop-down menu, toggle the “Core parameters only” button off in the Parameters section of the <code>FILTERS</code> tab.
                    </template>
                  </v-expansion-panel>
                  
                  <v-expansion-panel
                    title="Can I filter data by the number of observations?"
                  >
                    <template #text>
                      Yes, you can filter data by the number of observations using the slider in the Measurement Counts section at the bottom of the <code>FILTERS</code> tab. Note that the slider filters data by percentile and is therefore non-linear (i.e., the value displayed in the middle of the bar represents the median number of observations for the data shown on the map). Similar to the map, this slider dynamically updates depending on the other filters applied to the data.
                    </template>
                  </v-expansion-panel>
                  
                  <v-expansion-panel
                    title="How do I download data?"
                  >
                    <template #text>
                      Data from the Explorer can be downloaded three different ways:
                      <ol>
                        <li>To download the data from a single station and parameter shown on the timeseries plot in the <strong>Selected Station Data</strong> pop-up, click the DOWNLOAD button below the plot in the bottom right corner of the pop-up.</li>
                        <li>To download the data from multiple stations and parameters shown on the timeseries plot in the <code>COMPARE</code> tab, click the DOWNLOAD button below the plot in the bottom right corner of the tab.</li>
                        <li>To bulk download data from the stations shown on the map, click the <code>BULK DOWNLOAD</code> button in the bottom right corner of the <code>FILTERS</code> tab and follow the instructions in the window that appears. Note that only one year of data for one parameter can be downloaded using the <code>BULK DOWNLOAD</code> function. Once you have selected a parameter and time period of one year or less, you can obtain your file by clicking the DOWNLOAD button in the bottom left corner of the window.</li>
                      </ol>
                    </template>
                  </v-expansion-panel>
                  
                  <v-expansion-panel
                    title="How do I remove data filters?"
                  >
                    <template #text>
                      To remove data filters, click the <code>X</code> that appears next to the name of a filter that is currently being applied in the <code>FILTERS</code> tab. For some filters like Time Period, the <code>X</code> is only visible when you hover your mouse over the field. For fields where multiple filters can be applied at once (e.g., the <strong>Select station(s)</strong> and <strong>Select parameter(s)</strong> fields), filters can be removed individually by clicking the <code>X</code> next to each name or all at once by clicking the <code>X</code> that appears on the right side when you hover your mouse over the field.
                    </template>
                  </v-expansion-panel>
                  
                  <v-expansion-panel
                    title="How do I determine the number of stations that fit my search criteria?"
                  >
                    <template #text>
                      The number of stations that fit the search criteria currently being applied in the <code>FILTERS</code> tab is shown at the bottom left of that tab below the Measurement Counts section.
                    </template>
                  </v-expansion-panel>
                  
                  <v-expansion-panel
                    title="Can I visualize data on a log scale?"
                  >
                    <template #text>
                      Yes, you can adjust the y-axis to a log scale for timeseries plots in the <strong>Selected Station Data</strong> pop-up or the <code>COMPARE</code> tab to aid data visualization for parameters that are not normally distributed. To do this, click the <strong>Chart Options</strong> button in the bottom left corner of the plot and toggle the <strong>Log Scale</strong> button on.
                    </template>
                  </v-expansion-panel>
                  
                  <v-expansion-panel
                    title="What does the 'Lock to Time Period' button do?"
                  >
                    <template #text>
                      The <strong>Lock to Time Period</strong> button allows users to choose whether they want the timeseries plots shown in the Explorer to automatically zoom into the time period that is selected in the <code>FILTERS</code> tab or remain fixed at whatever zoom they are already set to if the time period filter is adjusted. The <strong>Lock to Time Period</strong> button can be found when you click the <strong>Chart Options</strong> button below the plots in the <strong>Selected Station Data</strong> pop-up and the <code>COMPARE</code> tab. By default, the <strong>Lock to Time Period</strong> button is toggled on, meaning that the plots will automatically zoom to the time period that is selected in the <code>FILTERS</code> tab.
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="Why is the time period filter not working? Why are there some stations shown that don't have data when I enter a specific time period?"
                  >
                    <template #text>
                      To improve the speed of the Explorer, the time period filter intentionally ignores data gaps. In other words, the stations that remain on the map that do not have data within the specified time period in the <code>FILTERS</code> tab are shown because they do have data both before and after that time period. To better understand the temporal data availability for these stations, adjust the sliders in the context chart directly below the timeseries plot in the <strong>Selected Station Data</strong> pop-up to find where the data lie before and after your selected time period.
                    </template>
                  </v-expansion-panel>
                  
                  <v-expansion-panel
                    title="Can I compare data across different stations and parameters within the Explorer?"
                  >
                    <template #text>
                      Yes, within the Explorer you can compare data across multiple stations and parameters using the <code>COMPARE</code> tab. You can compare an unlimited number of parameter-station combinations within the timeseries plot in the <code>COMPARE</code> tab.
                    </template>
                  </v-expansion-panel>
                  
                  <v-expansion-panel
                    title="How do I add data to the COMPARE tab?"
                  >
                    <template #text>
                      To add data to the <code>COMPARE</code> tab, display the data that you would like to add on the timeseries plot in the <strong>Selected Station Data</strong> pop-up and then click the <strong>Add to Compare</strong> button below the plot in the bottom left corner of the pop-up. The data timeseries will now appear in the <code>COMPARE</code> tab, both on the timeseries plot and in the summary table below the plot.
                    </template>
                  </v-expansion-panel>
                  
                  <v-expansion-panel
                    title="How do I remove data from the COMPARE tab?"
                  >
                    <template #text>
                      To remove a single data timeseries from the <code>COMPARE</code> tab, simply click the <code>X</code> next to the data timeseries in the summary table below the plot. To remove all data timeseries from the <code>COMPARE</code> tab, click the <strong>Clear</strong> button in the bottom left corner of the <code>COMPARE</code> tab.
                    </template>
                  </v-expansion-panel>
                  
                  <v-expansion-panel
                    title="How do I change the zoom of the timeseries plots in the 'Selected Station' Data pop-up and the COMPARE tab?"
                  >
                    <template #text>
                      The zoom of timeseries plots can be adjusted in five different ways:
                      <ol>
                        <li>Clicking and dragging your mouse on the plot to select the area you would like to zoom in on.</li>
                        <li>Adjusting the sliders on the context chart directly below the plot to specify the time period you would like to zoom in on.</li>
                        <li>Select the desired zoom interval (e.g., 1 month, 6 months, 1 year) from the drop-down menu in the top left corner of the plot area.</li>
                        <li>Manually input the time period of interest in the fields directly above the plot.</li>
                        <li>Adjust the start and end dates for the two fields in the Time Period section of the <code>FILTERS</code> tab while the “Lock to Time Period” button for the plot is turned on.</li>
                      </ol>
                    </template>
                  </v-expansion-panel>
                  
                  <v-expansion-panel
                    title="How do I export plots from the Explorer?"
                  >
                    <template #text>
                    To export a plot that is currently displayed in the Explorer either in the <strong>Selected Station Data</strong> pop-up or the <code>COMPARE</code> tab, simply click the menu icon in the top right corner of the plot and select the desired option. Plots can either be downloaded as a PNG, JPEG, or PDF, or they can be printed directly from the Explorer by selecting the “Print chart” option. For printing, it is recommended that you expand the plot to the whole screen first by selecting the “View in full screen” option.
                    </template>
                  </v-expansion-panel>
                  
                  <v-expansion-panel
                    title="How do I select a station that is hidden under another station?"
                  >
                    <template #text>
                    To select a station that is hidden beneath another station, first click on top of the group of stations at that location. The Explorer will by default display the data from the top station on the timeseries plot in the <strong>Selected Station Data</strong> pop-up. Next, to toggle the selection between stations in the group, click the PREV and NEXT buttons at the top of the <strong>Selected Station Data</strong> pop-up. You will notice that this both changes the station that is selected on the map and the station that is displayed in the <strong>Selected Station Data</strong> pop-up.
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I change the basemap in the Explorer?"
                  >
                    <template #text>
                    To change the basemap displayed in the background of the Explorer, hover over the layer icon in the top left corner of the map and select a new basemap. There are seven different basemaps to choose from, as well as the option for no basemap.
                    </template>
                  </v-expansion-panel>
                  
                  <v-expansion-panel
                    title="Where can I find metadata for the stations?"
                  >
                    <template #text>
                      Once a station is selected, metadata for the station can be found above the timeseries plot in the <strong>Selected Station Data</strong> pop-up. Metadata displayed there include station alias, station name, coordinates, and waterbody ID. This metadata is also included in data files downloaded from the Explorer.
                    </template>
                  </v-expansion-panel>

                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>

ol {
  margin-left: 32px;
  margin-top: 8px;
}

code {
  margin-right: 8px;
  margin-left: 8px;
  padding-right: 4px;
  padding-left: 4px;
  background-color: #EEE;
  font-weight: 600;
}

.text-body-1 {
  font-size: 1.1rem !important;
}

p {
  margin-left: 16px;
  margin-top: 8px;
}

div.user-guide-container {
  float: right;
  width: 330px;
  text-align: center;
  background: rgba(250,250,250,0.5);
  border-radius: 10px;
}
</style>
