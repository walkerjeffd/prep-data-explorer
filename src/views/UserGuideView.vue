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
          <v-sheet elevation="8" class="px-8 px-lg-12 pt-8 pt-lg-16 pb-8 prep-hero text-body-1">
            <div class="text-h4 text-lg-h3">User Guide</div>
            <v-divider class="mb-8"></v-divider>

            <v-row class="align-center justify-center">
              <v-col cols="12" lg="3" class="text-center">
                <a download href="pdf/Piscataqua_Watershed_Data_Explorer_User_Guide.pdf" class="pb-0 mx-auto">
                  <v-img src="/img/user-guide-cover.png" class="elevation-2 my-2 mx-auto" style="border-radius:10px;" width="300"></v-img>
                </a>
              </v-col>
              <v-col cols="12" lg="5" class="text-center text-lg-left">
                <div class="mb-8 text-h6">
                  The User Guide provides detailed instructions on how to filter, visualize, and download data.
                </div>
                <v-btn color="accent" size="large" download href="pdf/Piscataqua_Watershed_Data_Explorer_User_Guide.pdf">
                  <v-icon icon="mdi-download" start></v-icon> Download User Guide (PDF)
                </v-btn>
              </v-col>
            </v-row>

            <div class="text-h4 text-lg-h3 mt-12">Frequently Asked Questions</div>
            <v-divider class="mb-8"></v-divider>

            <v-row>
              <v-col cols="12">
                <v-expansion-panels>
                  <v-expansion-panel
                    title="How do I view data?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/view-data.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <div>
                            Click on a station on the map, then use the dropdown menu to choose between the available parameters.
                          </div>
                          <p>
                            If you have selected any parameters in the <code>FILTERS</code> sidebar, then the chart will show data for the first selected parameter. Otherwise, it will default to whichever available parameter comes first alphabetically among the available parameters at that station.
                          </p>
                          <p>
                            If you have selected a start and/or end date for the <strong>Time Period</strong> on the <code>FILTERS</code> sidebar, the chart will automatically zoom to that period. You can also zoom the timeseries chart in and out using the smaller time period chart at the bottom of the <strong>Selected Station Data</strong> window.
                          </p>
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I compare data between multiple stations or parameters?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/compare-1.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          First, add each timeseries to the <code>COMPARE</code> sidebar by clicking the <strong>Add to Compare</strong> button below the chart on the <strong>Selected Station Data</strong> window. Then select a different parameter or station, and add the next timeseries.
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/compare-2.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          After adding multiple timeseries, you can zoom in and out using the smaller time period chart, or hide/show invididual timeseries by clicking on them in the chart legend. You can also remove individual timeseries from the <code>COMPARE</code> tool by clicking the <v-icon size="x-small">mdi-close-circle</v-icon> icon beside it. Or click <strong>Clear</strong> to remove all of the timeseries.
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I download data?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/download-1.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <div class="text-h5">Option 1: Single Station and Parameter</div>
                          <p>To download data for a single station and parameter, click the <strong>Download</strong> button below the timeseries chart in the <strong>Selected Station Data</strong> window. The data will be downloaded as a Comma-Separate Values (CSV) file containing the timeseries values and associated station and sampling metadata.</p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/download-2.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <div class="text-h5">Option 2: Multiple Stations and/or Parameters</div>
                          <p>To download data for multiple stations and parameters, first add them to the <code>COMPARE</code> sidebar (see previous FAQ question), then click the <strong>Download</strong> button below the comparison timeseries chart. This should only be used for a handful of stations or parameters at a time.</p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/download-3a.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <div class="text-h5">Option 3: Bulk Download (Many Stations)</div>
                          <p>To download large quantities of data across many stations, use the <strong>Bulk Download</strong> tool. To limit the file size, only one parameter and up to one year of data can be downloaded at a time using this tool. However, it can be used to download data across a large number of available stations.</p>
                          <p>To download data for only a subset of those stations, first filter them using a <strong>Spatial Filter Layer</strong>, or by selecting them from the dropdown in the <strong>Station</strong> section of the <code>FILTERS</code> sidebar (see FAQ questions below).</p>
                          <p>After filtering for the target stations (if necessary), click the <strong>Bulk Download</strong> button at the bottom of the <code>FILTERS</code> sidebar.</p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/download-3b.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <div>Then, select the parameter of interest, enter the start and end dates, and click <strong>Download</strong>. To download more than one parameter or year of data, repeat this process multiple times.</div>
                          <p>If this process is too burdensome for your data needs, please contact Trevor Mattera at <a href="mailto:Trevor.Mattera@unh.edu">Trevor.Mattera@unh.edu</a> to request a larger database export.</p>
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I find data for a specific time period?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/time-period.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <div>
                            Type in dates or use the calendar drop-down menus under <strong>Time Period</strong> on the <strong>FILTERS</strong> sidebar to specify the start and/or end dates for the period of interest. The map will automatically update to show only stations that have data collected during that period, and the list of available parameters will similarly be updated to only include those with data during that period. 
                          </div>
                          <p>
                            For example, to see which stations and parameters have data collected in the year 2020, you would set the <strong>Start Date</strong> to <strong>01/01/2020</strong> and <strong>End Date</strong> to <strong>12/31/2020</strong>.
                          </p>
                          <p>
                            You may also specify only one of the two dates (start or end) to define an open-ended period. For example, if the <strong>Start Date</strong> is set to <strong>01/01/2020</strong> and the end date is left blank, then the map will show only stations having at least some data collected any day since January 1, 2020.
                          </p>
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I find data for a specific station?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/filter-station.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          If you already know the name or code of a station, you can search for it and then select it using the dropdown in the <strong>Stations</strong> section of the <code>FILTERS</code> sidebar. You can select more than one station from this dropdown, which will filter the dataset and list of available parameters for only those with data collected at the selected stations.
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I focus on stations within a specific area, like a waterbody, basin, or town?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/spatial-filter-layer-1.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          First, add a <strong>Spatial Filter Layer</strong> to the map using the <strong>Map Layers</strong> dropdown in the legend. Only layers marked with a <v-icon size="small" color="grey-darken-1">mdi-filter</v-icon> symbol can be used as spatial filters.
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/spatial-filter-layer-2.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          Then click on a polygon on the map to select only stations within that area. The selected spatial area will be shown in the <strong>Stations</strong> section of the <strong>FILTERS</strong> sidebar. To return to all stations, click the polygon again, or click the close icon (<v-icon size="x-small">mdi-close</v-icon>) beside the area name.
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I find data for specific parameters (e.g., temperature, dissolved oxygen, chlorophyll-a)?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/filter-parameter-1.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          First, search for a parameter by name using the dropdown in the <strong>Parameters</strong> section of the <code>FILTERS</code> sidebar.
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/filter-parameter-2.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          Then, select one or more parameters from the dropdown to see which stations have data for those parameters.
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I focus on stations that have the most available data?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/measurement-counts.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <p>The <strong>Measurement Counts</strong> slider in the <code>FILTERS</code> sidebar lets you focus on stations having a minimum (or maximum) number of measurements. This is useful, for example, to exclude stations that have relatively little data.</p>
                          <p>Because the number of measurements at each station is highly skewed (a few stations have A LOT of measurements, and many stations have only a couple measurements), the slider operates on a non-linear scale. The left-most number indicates the <strong>minimum</strong> number of measurements at a single station, and the right-most number is the <strong>maximum</strong>. The number in the middle is the <strong>median</strong> number of measurements over all the available stations.</p>
                          <p>For example, if the lower end of the slider is moved to the middle value (median), then only the top 50% of the available stations with the most data are shown.</p>
                          <p>Note that the range of this slider range automatically adjusts to reflect the selected stations and parameters in the filters above it.</p>
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="What are the 'Core' stations and parameters?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/filter-core.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          Because the database contains so much data, the Explorer starts by showing only a primary (or "Core") set of stations and parameters. To view <strong>ALL</strong> available stations or parameters, click the respective toggle switch to turn them off.
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I make the timeseries charts bigger?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/chart-full-screen.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          Open the chart menu in the top right-corner, then click <strong>View Full Screen</strong>.
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I download the charts as image files?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/chart-download.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          Open the chart menu in the top right-corner, then click one of the <strong>Download</strong> options to save the chart as a PNG, JPG, or PDF file.
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I view the data on a log scale?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/chart-log.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          Open the <strong>Chart Options</strong> menu below the chart, then toggle the <strong>Log Scale</strong> option.
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="What does the 'Lock to Time Period' button do?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/chart-lock-time.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          The <strong>Lock to Time Period</strong> option in the <strong>Chart Options</strong> menu synchronizes the time period shown on the chart with the start and end dates in the <strong>Time Period</strong> section of the <code>FILTERS</code> sidebar. By default, the <strong>Lock to Time Period</strong> option is enabled meaning the chart will automatically zoom to the filtered time period. To disable this behavior, turn off this option and the chart will start with the full period of available data regardless of the time period filter.
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="I entered a time period filter, why do I see stations that have no data during that period?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/data-gap.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          The <strong>Time Period</strong> filter is not aware of data gaps, and only considers the first and last measurement date of each parameter and station. For example, if the first and last available measurement dates are January 1, 2020 and December 31, 2022 for a given station and parameter, then the Explorer would assume that it contains at least some data in 2021. Therefore, if the user set a <strong>Time Period</strong> from Jan 1, 2021 - Dec 31, 2021, then that station would still appear on the map even if it did not in fact have any measurements in that year due to a gap in sampling.
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I select a station that is hidden under another station?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/station-overlap.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <div>
                            In some cases, the map symbols for two or more stations may overlap due to their close proximity, especially when viewing all stations (i.e., when <strong>Core Stations Only</strong> is disabled).
                          </div>
                          <p>
                            To select a station that is hidden beneath another station, first click on top of the group of stations at that location. Then use the <strong>Prev</strong> and <strong>Next</strong> buttons in the <strong>Selected Station Toolbar</strong> to cycle through them.
                          </p>
                          <p>
                            Note that data for only one of these stations can be viewed at a time in the <strong>Selected Station Data</strong> window. To view data across multiple, overlapping stations at once, add the timeseries from each station to the <code>COMPARE</code> sidebar (see FAQ question above).
                          </p>
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>

                  <v-expansion-panel
                    title="How do I change the basemap?"
                  >
                    <template #text>
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-img src="/img/user-guide/basemaps.jpeg" class="elevation-2" style="border-radius:10px;"></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                          Hover your mouse over the <strong>Basemaps</strong> icon in the top-left corner of the map, and choose a new basemap.
                        </v-col>
                      </v-row>
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
