/*
 * File: index.vue.ts
 * File Created: 2023-01-16 12:42:05
 * Author: Val Liu <valuis0429@gmail.com>
 *
 * -----
 * Last Modified: 2023-12-13 05:46:39
 * Modified By: Val Liu
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
  get thisRouter() {
    let routers = FindRouter({
      path: this.$route.path,
    });
    return routers.length === 0 ? null : routers[routers.length - 1];
  }

  /// private helper
  className: string = "theme";
  private mounted() {
    // this.$nextTick(() => {
    const name = getComputedStyle(this.$el).getPropertyValue("--theme-name");
    this.className = name;
    // });
    this.$nextTick(() => this.reinstallCss());
  }

  private reinstallCss() {
    let style = getComputedStyle(
      document.getElementsByClassName(this.className)[0]
    );
    let todoList: any[] = [];
    varList.forEach((v) => {
      varSubList.forEach((k) => {
        let key = `${v}${k}`;
        todoList.push(() => {
          document.documentElement.style.setProperty(
            key,
            style.getPropertyValue(key)
          );
        });
      });
    });

    const doNext = () => {
      setTimeout(() => {
        let func = todoList.shift();
        if (!func) return;
        func();
        doNext();
      }, 0);
    };
    doNext();
  }
}
export default CoreUI;

/// private helpers
const varList = [
  "--primary",
  "--secondary",
  "--success",
  "--warning",
  "--info",
  "--danger",
  "--light",
  "--dark",
];
const varSubList = [
  "",
  "-100",
  "-200",
  "-300",
  "-400",
  "-500",
  "-600",
  "-700",
  "-800",
  "-900",
  "-yiq",
];
