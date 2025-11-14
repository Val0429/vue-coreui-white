<template>
  <li
    v-if="$slots.default"
    :class="{ 'nav-item': true, 'nav-dropdown': true, open: innateOpen, 'is-disabled': disabled }"
    :to="url"
  >
    <div
      class="nav-link nav-dropdown-toggle"
      style="cursor: pointer"
      :class="blockClassList()"
    >
      <div class="row dropdown-container">
        <div
          v-if="!hasComponent"
          style="flex: 1"
          @click="handleClick"
          :class="classList()"
        >
          <i :class="classIcon"></i> {{ getLabel() }}
        </div>
        <element
          v-else
          style="flex: 1"
          :is="isExternalLink ? 'a' : 'router-link'"
          :href="url"
          :to="url"
          :disabled="disabled"
          :class="classList()"
        >
          <i :class="classIcon"></i> {{ getLabel() }}
        </element>

        <div class="dropdown-btn" @click="handleClick" />
      </div>
    </div>
    <ul class="nav-dropdown-items" v-if="!isBlocked()">
      <slot></slot>
    </ul>
  </li>
  <SidebarNavItemCore v-else>
    <SidebarNavLinkCore
      :name="getLabel()"
      :url="url"
      :icon="icon"
      :data="data"
      :disabled="disabled"
    />
  </SidebarNavItemCore>
</template>

<style lang="scss" scoped>
.nav-item ::v-deep .nav-item {
  text-indent: 8px;
}
::v-deep .nav-icon {
  min-width: 1.3rem;
}
.dropdown-container {
  margin-top: -12px;
  margin-bottom: -12px;
  .dropdown-btn {
    position: absolute;
    right: 0;
    top: 0;
    width: 45px;
    height: 45px;
  }
}

@mixin common-styles {
  .blocked-prod,
  .invalid-prod {
    display: none !important;
  }
  .invalid {
    position: relative;
    background: var(--warning) !important;
    border: 2px dashed var(--danger);
    pointer-events: none;
  }
  .invalid::after {
    position: absolute;
    right: 3px;
    bottom: 0;
    font-size: 10px;
    color: var(--light);
    content: var(--content-invalid) !important;
  }

  .blocked {
    position: relative;
    background: var(--danger) !important;
    border: 2px dashed var(--info);
    pointer-events: none;
  }
  .blocked::after {
    position: absolute;
    right: 3px;
    bottom: 0;
    font-size: 10px;
    color: var(--light);
    content: var(--permission-denied) !important;
  }
}

@include common-styles;
::v-deep {
  @include common-styles;
}
</style>

<style lang="scss">
li.nav-item.is-disabled, li.nav-item > a.is-disabled {
  opacity: 0.55;
  cursor: not-allowed !important;
  pointer-events: none; // 阻擋所有互動
}
</style>

<script lang="ts">
/*
 * Created on Tue Jul 30 2019
 * Author: Val Liu
 * Copyright (c) 2019, iSAP Solution
 */

import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { SidebarNavItem as SidebarNavItemCore } from "@coreui/vue";
import SidebarNavLinkCore from "./private/SidebarNavLink.vue";
import { FindRouter } from "@/../core/router";
import { PermissionHelper } from "@root/core/utilities/permission-helper";
let config = require("@/config/default/debug");

interface IData {
  variant?: string;
  badge?: {
    label?: string;
    variant?: string;
  };
}

@Component({
  components: { SidebarNavItemCore, SidebarNavLinkCore },
})
export default class SidebarNavItem extends Vue {
  @Prop({
    type: String,
    required: false,
  })
  label: string | undefined;

  @Prop({
    type: String,
    required: true,
  })
  url!: string;

  @Prop({
    type: String,
    required: false,
  })
  icon: string | undefined;

  @Prop({ type: Boolean, default: false })
  disabled!: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  open!: boolean;

  @Prop({
    type: Object,
    required: false,
  })
  data: IData | undefined;

  /// private helper
  private innateOpen: boolean = true;
  @Watch("open", { immediate: true })
  private onOpenChanged(newval: boolean, oldval: boolean) {
    if (newval === oldval) return;
    this.innateOpen = newval;
  }

  private handleClick(e) {
    e.preventDefault();
    if (this.disabled) return;
    this.innateOpen = !this.innateOpen;
  }

  private getLabel(): string {
    if (this.label) return this.label;
    let routers = FindRouter({ path: this.url });
    return routers.length === 0
      ? ""
      : this.parseName(routers[routers.length - 1].name);
  }

  private parseName(name): string {
    return this.$_(name);
    // let regex = /_\(\'*(.*)\'\)/;
    // if (!name) return name;
    // let matches = name.match(regex);
    // if (!matches || matches.length < 2) return name;
    // return this.$_(matches[1]);
  }

  private get classIcon() {
    let classes = ["nav-icon", "fa"];
    let icon: string | undefined = this.icon;
    if (!icon) {
      let routers = FindRouter({ path: this.url });
      if (routers.length === 0) return classes;
      icon = routers[routers.length - 1].icon;
    }
    if (!icon) return classes;
    if (/^isap/.test(icon)) classes.push("isap-icon");
    classes.push(icon);
    return classes;
  }

  private get hasComponent() {
    /// function: has component
    /// object: router
    let routers = FindRouter({ path: this.url });
    if (routers.length === 0) return false;
    let router = routers[0];
    return router.component != undefined;
  }

  private get isExternalLink() {
    return Boolean(/^http/.test(this.url));
  }

  private isBlocked() {
    /// 1) allow external link
    if (this.isExternalLink) return false;
    let routers = FindRouter({ path: this.url });
    if (routers.length === 0) return false;
    let router = routers[routers.length - 1];

    /// check permission
    return !PermissionHelper.authRouter.call(this, router);
  }

  private isInvalid() {
    let routers = FindRouter({ path: this.url });
    return routers.length === 0;
  }

  // private classList() {
  //   return ["nav-link"];
  // }

  private blockClassList() {
    return [
      this.isBlocked()
        ? config.prodMode || !config.showNonePermissionBlock
          ? "blocked-prod"
          : "blocked"
        : "",
      this.isInvalid()
        ? config.prodMode || !config.showNonePermissionBlock
          ? "invalid-prod"
          : "invalid"
        : "",
    ];
  }

  private classList() {
    return [
      "nav-link",
      this.data && this.data.variant ? `nav-link-${this.data.variant}` : "",
    ];
  }

  // private classList() {
  //   return [
  //     "nav-link",
  //     this.data && this.data.variant ? `nav-link-${this.data.variant}` : "",
  //     this.isBlocked()
  //       ? config.prodMode || !config.showNonePermissionBlock
  //         ? "blocked-prod"
  //         : "blocked"
  //       : "",
  //     this.isInvalid()
  //       ? config.prodMode || !config.showNonePermissionBlock
  //         ? "invalid-prod"
  //         : "invalid"
  //       : "",
  //   ];
  // }
}
</script>
