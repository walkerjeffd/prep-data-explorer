<script setup lang="ts">
</script>

<template>
  <v-img
    class="bg-white prep-splash"
    width="100%"
    :aspect-ratio="2.5"
    src="/img/Monkman_NHSCS_D32617_2400.jpg"
    cover
  ></v-img>
  <div class="d-flex justify-center">
    <v-container style="position:absolute;top:100px">
      <v-row class="justify-center">
        <v-col cols="12" xl="10">
          <v-sheet elevation="8" class="px-8 px-lg-12 pt-8 pt-lg-16 pb-8 prep-hero">
            <div class="text-h4 text-lg-h3">Welcome to the Piscataqua Watershed Data Explorer</div>
            <v-row class="my-2 mt-lg-8">
              <v-col cols="12" xl="6" class="pr-8">
                <div class="text-center">
                  <router-link :to="{name: 'explorer'}" >
                    <v-img src="/img/screenshot.jpg" class="elevation-2 mb-8 my-2" style="border-radius:10px"></v-img>
                  </router-link>
                  <div v-if="$vuetify.display.mobile">
                    <v-alert type="warning" class="text-left">
                      <div class="font-weight-bold">Mobile Devices Not Supported</div>
                      Please come back on a device with a larger screen size.
                    </v-alert>
                  </div>
                  <div v-else class="my-8 my-xl-0">
                    <v-btn :to="{name: 'explorer'}" color="accent" size="x-large">
                      Open Explorer <v-icon icon="mdi-arrow-right" class="ml-2"></v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" xl="6">
                <p class="font-size-larger">
                  The Piscataqua Watershed Data Explorer is an interactive web application that allows users to explore, analyze, and download data from the <a href="https://prepestuaries.org/">Piscataqua Region Estuaries Partnership (PREP)</a> database. This database represents the most comprehensive collection of environmental data for the watersheds of coastal New Hampshire, containing the results from monitoring activies and projects carried out by multiple organizations, including the <a href="https://www.unh.edu/">University of New Hampshire (UNH)</a>, <a href="https://www.des.nh.gov/">New Hampshire Department of Environmental Services (NHDES)</a>, and PREP.
                </p>
                <p class="my-4 font-size-larger">
                  The Piscataqua Watershed Data Explorer provides scientists, academic researchers, resource managers, students, and other interested stakeholders with a one-stop tool to access environmental data collected across the Piscataqua Watershed in coastal Maine and New Hampshire. Through its interactive web map, dynamic filters, and data visualization tools, this application is designed to aid data discovery, exploration, and downloading so users can find and retrieve the data they need to support their own analyses and research.
                </p>
                <p class="my-4 font-size-larger mb-0">
                  For questions or more information, please contact Trevor Mattera at <a href="mailto:Trevor.Mattera@unh.edu">Trevor.Mattera@unh.edu</a>.
                </p>
              </v-col>
            </v-row>
            <v-divider class="my-xl-8 my-2"></v-divider>
            <p class="my-4 mb-0 text-center">
              Designed and built by <a href="https://walkerenvres.com">Walker Environmental Research</a> in collaboration with <a href="https://www.fbenvironmental.com/">FB Environmental</a>. Aerial photo by <a href="https://ecophotography.com/">Jerry Monkman</a>.
            </p>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
