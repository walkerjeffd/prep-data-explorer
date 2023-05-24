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
        <v-col cols="12" lg="12" xl="8">
          <v-sheet elevation="8" class="px-12 pt-16 pb-8 prep-hero">
            <h1 class="text-h3">Welcome to the Piscataqua Watershed Data Explorer</h1>
            <p class="my-8 font-size-larger">
              The <a href="https://prepestuaries.org/">Piscataqua Region Estuaries Partnership (PREP)</a> is pleased to present the Piscataqua Watershed Data Explorer (currently in beta).
            </p>
            <div class="text-center my-12">
              <v-btn :to="{name: 'explorer'}" color="accent" size="x-large">
                Open Explorer <v-icon icon="mdi-arrow-right" class="ml-2"></v-icon>
              </v-btn>
            </div>
            <v-alert title="Feedback Wanted" type="info" variant="tonal" border="start" class="my-8">
              <div class="font-weight-bold font-size-larger text-body-1">
                We are currently soliciting feedback on the features and functionality of this web application. If you have any feedback or suggestions, we kindly ask that you please fill out a brief <a href="https://forms.gle/ozV4rq3T2dS1vMrQ8" target="_blank">Google Survey Form</a> so we may improve this website.
              </div>
              <div class="text-left mt-4">
                <v-btn href="https://forms.gle/ozV4rq3T2dS1vMrQ8" target="_blank" color="info" size="default" variant="flat" prepend-icon="mdi-file-document-edit-outline">
                  Open Feedback Form
                </v-btn>
              </div>
            </v-alert>
            <p class="my-4 font-size-larger">
              The Piscataqua Watershed Data Explorer is an interactive web application that allows users to explore, analyze, and download data from the <a href="https://prepestuaries.org/">Piscataqua Region Estuaries Partnership (PREP)</a> database. This database represents the most comprehensive collection of environmental data for the watersheds of coastal New Hampshire, containing the results from monitoring activies and projects carried out by multiple organizations, including the <a href="https://www.unh.edu/">University of New Hampshire (UNH)</a>, <a href="https://www.des.nh.gov/">New Hampshire Department of Environmental Services (NHDES)</a>, and PREP.
            </p>
            <p class="my-4 font-size-larger">
              The Piscataqua Watershed Data Explorer provides scientists, academic researchers, resource managers, students, and other interested stakeholders with a one-stop tool to access environmental data collected across the Piscataqua Watershed in coastal Maine and New Hampshire. Through its interactive web map, dynamic filters, and data visualization tools, this application is designed to aid data discovery, exploration, and downloading so users can find and retrieve the data they need to support their own analyses and research.
            </p>
            <p class="my-4 font-size-larger mb-4">
              For questions or more information, please contact Trevor Mattera at <a href="mailto:Trevor.Mattera@unh.edu">Trevor.Mattera@unh.edu</a>.
            </p>
            <v-divider class="my-4"></v-divider>
            <p class="my-4 mb-4">
              Designed and built by <a href="https://walkerenvres.com">Walker Environmental Research</a> in collaboration with <a href="https://www.fbenvironmental.com/">FB Environmental</a>. Aerial photo by <a href="https://ecophotography.com/">Jerry Monkman</a>.
            </p>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
