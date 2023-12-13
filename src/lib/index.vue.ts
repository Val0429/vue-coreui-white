/*
 * File: index.vue.ts
 * File Created: 2023-01-16 12:42:05
 * Author: Val Liu <valuis0429@gmail.com>
 *
 * -----
 * Last Modified:
 * Modified By:
 * -----
 */

import { Vue, Component } from "vue-property-decorator";
import DefaultContainer from "./containers/DefaultContainer.vue";
// import DefaultAside from "./containers/DefaultAside.vue";
// import DefaultHeader from "./containers/DefaultHeaderDropdownAccnt.vue";

import "core-js/es6/promise";
import "core-js/es6/string";
import "core-js/es7/array";
import BootstrapVue from "bootstrap-vue";
import { FindRouter } from "@/../core";

Vue.use(BootstrapVue);

/**
 * Simplest container
 */
@Component({
  components: { DefaultContainer },
})
export class CoreUI extends Vue {
  // render(createElement) {
  //     return createElement(DefaultContainer, {
  //         slots: this.$slots,
  //         scopedSlots: this.$scopedSlots
  //     });
  // }

  private get thisRouter() {
    let routers = FindRouter({
      path: this.$route.path,
    });
    return routers.length === 0 ? null : routers[routers.length - 1];
  }
}
export default CoreUI;
