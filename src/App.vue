<script setup lang="ts">
const links: any[] = [
  {
    label: 'Home',
    name: 'home',
    icon: 'mdi-home',
  },
  {
    label: 'About',
    name: 'about',
    icon: 'mdi-information',
  },
  {
    label: 'Contact',
    name: 'contact',
    icon: 'mdi-email',
  },
]
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-img src="@/assets/prep_horiz.png" max-height="80%" max-width="200"/>
      <v-app-bar-title text="Piscataqua Watershed Data Explorer" class="font-weight-medium text-h4">
        <span class="text-button font-weight-bold text-disabled">ALPHA</span>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-tabs
        color="primary"
        class="mr-4"
      >
        <v-tab
          v-for="link in links"
          :key="link"
          :prepend-icon="link.icon"
          :to="{ name: link.name }"
          class="mx-2"
        >
          {{ link.label }}
        </v-tab>
        <v-divider vertical class="mx-4"></v-divider>
        <v-tab
          class="text-h6"
          prepend-icon="mdi-earth"
          :to="{ name: 'explorer' }"
        >
          Explorer
        </v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
