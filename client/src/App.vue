<template>
  <router-view/>
</template>

<style lang="scss">
@import "@/assets/scss/main.scss";
@import "@/assets/scss/_variables.scss";
#app {
  display: flex;
  justify-content: center;
  align-items: center;

  background: rgb(238,174,202);
  background: radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%);
  color: $main-text-color;
}
</style>
