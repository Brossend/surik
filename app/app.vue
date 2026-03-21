<template>
  <div id="__div" class="app-shell">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <div class="app-shell__glow app-shell__glow--top-left" />
    <div class="app-shell__glow app-shell__glow--bottom-right" />
  </div>
</template>

<style lang="scss" scoped src="./app.scss" />