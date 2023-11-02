<script setup lang="ts">
interface Link {
  label: string
  name: string
  icon: string
}

const links: Link[] = [
  {
    label: 'Home',
    name: 'home',
    icon: 'mdi-home',
  },
  {
    label: 'User Guide',
    name: 'user-guide',
    icon: 'mdi-help-circle',
  },
]
</script>

<template>
  <v-app>
    <v-app-bar v-if="$vuetify.display.mobile">
      <v-img src="@/assets/prep_horiz.png" max-height="80%" max-width="200" />
      <v-spacer></v-spacer>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="link in links"
            :key="link"
            :prepend-icon="link.icon"
            :to="{ name: link.name }"
            link
          >
            <v-list-item-title>{{ link.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-app-bar v-else>
      <v-img src="@/assets/prep_horiz.png" max-height="80%" max-width="200" />
      <v-app-bar-title text="Piscataqua Watershed Data Explorer" class="font-weight-medium text-h4">
      </v-app-bar-title>
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
          EXPLORER
        </v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
