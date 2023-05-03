<template>
  <div class="d-flex justify-center">
    <v-container fluid>
      <v-row class="justify-center">
        <v-col cols="12" lg="8" xl="6">
          <v-sheet elevation="4" class="px-12 pt-8 pb-16" style="background-color: rgba(255, 255, 255, 0.8);">
            <h1 class="text-h3">About the Project</h1>
            <p class="mt-8 mb-16">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati harum esse recusandae optio debitis animi, quas culpa ab suscipit? Sint corporis dolores eveniet debitis sapiente ullam atque itaque accusantium quas!
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati harum esse recusandae optio debitis animi, quas culpa ab suscipit? Sint corporis dolores eveniet debitis sapiente ullam atque itaque accusantium quas!
            </p>
            <div class="text-center mt-12">
              <v-btn :to="{name: 'explorer'}" color="accent" size="x-large">
                <v-icon icon="mdi-arrow-left" start></v-icon> Back to Home
              </v-btn>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
