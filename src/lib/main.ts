/*
 * File: index.vue.ts
 * File Created: 2023-01-16 12:42:05
 * Author: Val Liu <valuis0429@gmail.com>
 *
 * -----
 * Last Modified: 2024-01-08 02:05:39
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
  className: string = "v-theme-";
  private mounted() {
    const name = getComputedStyle(this.$el).getPropertyValue("--theme-name");
    this.className = name;

    /// remove all body classes start with `v-theme-*`
    const regex = /^v-theme-/;
    document.body.classList.forEach(
      (cls) => regex.test(cls) && document.body.classList.remove(cls)
    );
    /// add new class into
    document.body.classList.add(name);

    /// reinstall css
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
