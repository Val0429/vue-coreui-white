<template>
  <iv-auto-transition :class="className" type="iv-fade-slide">
    <DefaultContainer v-if="!thisRouter.disableContainer" key="1">
      <template v-for="(_, slot) of $slots">
        <slot :name="slot" />
      </template>
      <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </DefaultContainer>

    <router-view v-else key="2" />
  </iv-auto-transition>
</template>

<script src="./main.ts"></script>

<style lang="scss">
@import "assets/scss/style";
</style>

<style lang="scss" scoped>
@import "assets/scss/style";
* {
  // export the theme name
  --theme-name: #{$theme-name};
}

/* This styles the scrollbar track (the background) */
::-webkit-scrollbar {
  width: 0; /* for vertical scrollbars */
  height: 0; /* for horizontal scrollbars */
  background: transparent; /* scrollbar track should be transparent */
}

/* This styles the scrollbar thumb (the moving part) */
::-webkit-scrollbar-thumb {
  background: rgba(
    0,
    0,
    0,
    0.5
  ); /* scrollbar thumb is semi-transparent black */
}
</style>
