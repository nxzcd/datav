import { ComponentClass } from 'react';
import { KeyValue } from './data';
import { NavModel } from './navModel';
import { PluginMeta, GrafanaPlugin, PluginIncludeType } from './plugin';

export enum CoreApp {
  Dashboard = 'dashboard',
  Explore = 'explore',
}

export interface AppRootProps<T = KeyValue> {
  meta: AppPluginMeta<T>;

  path: string; // The URL path to this page
  query: KeyValue; // The URL query parameters

  /**
   * Pass the nav model to the container... is there a better way?
   */
  onNavChanged: (nav: NavModel) => void;
}

export interface AppPluginMeta<T = KeyValue> extends PluginMeta<T> {
  // TODO anything specific to apps?
}

export class AppPlugin<T = KeyValue> extends GrafanaPlugin<AppPluginMeta<T>> {
  // Content under: /a/${plugin-id}/*
  root?: ComponentClass<AppRootProps<T>>;
  rootNav?: NavModel; // Initial navigation model


  /**
   * Called after the module has loaded, and before the app is used.
   * This function may be called multiple times on the same instance.
   * The first time, `this.meta` will be undefined
   */
  init(meta: AppPluginMeta) {}

  /**
   * Set the component displayed under:
   *   /a/${plugin-id}/*
   */
  setRootPage(root: ComponentClass<AppRootProps<T>>, rootNav?: NavModel) {
    this.root = root;
    this.rootNav = rootNav;
    return this;
  }

  setComponentsFromLegacyExports(pluginExports: any) {
    if (this.meta && this.meta.includes) {
      for (const include of this.meta.includes) {
        if (include.type === PluginIncludeType.page && include.component) {
          const exp = pluginExports[include.component];

          if (!exp) {
            console.warn('App Page uses unknown component: ', include.component, this.meta);
            continue;
          }
        }
      }
    }
  }
}

/**
 * Defines life cycle of a feature
 * @internal
 */
export enum FeatureState {
  alpha = 'alpha',
  beta = 'beta',
}
