<script setup lang="ts">
</script>

<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" md="8" lg="6">
        <div>
          <h1 class="text-h3">Welcome to the Piscataqua Watershed Data Explorer</h1>
          <p class="my-8">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati harum esse recusandae optio debitis animi, quas culpa ab suscipit? Sint corporis dolores eveniet debitis sapiente ullam atque itaque accusantium quas!
          </p>
          <div class="text-center mt-12">
            <v-btn :to="{name: 'explorer'}" color="accent" variant="tonal" size="x-large">
              Open Explorer <v-icon icon="mdi-arrow-right" class="ml-2"></v-icon>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
