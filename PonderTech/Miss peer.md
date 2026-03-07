---
title: "Miss peer"
created: "2024年11月29日 星期五 09:17:43"
modified: "2024年11月29日 星期五 09:17:47"
folder: "PonderTech"
---

# Miss peer

WARN  Issues with peer dependencies found

apps/dianzhanNew

├─┬ @nuxt/devtools-edge 1.6.0-28811759.fc7e9f7

│ ├── ✕ missing peer vite@"\*"

│ ├─┬ vite-plugin-inspect 0.8.7

│ │ └── ✕ missing peer vite@"^3.1.0 || ^4.0.0 || ^5.0.0-0"

│ ├─┬ @nuxt/devtools-kit-edge 1.6.0-28811759.fc7e9f7

│ │ └── ✕ missing peer vite@"\*"

│ ├─┬ @vue/devtools-core 7.4.4

│ │ └─┬ vite-hot-client 0.2.3

│ │ └── ✕ missing peer vite@"^2.6.0 || ^3.0.0 || ^4.0.0 || ^5.0.0-0"

│ └─┬ vite-plugin-vue-inspector 5.1.3

│ └── ✕ missing peer vite@"^3.0.0-0 || ^4.0.0-0 || ^5.0.0-0"

├─┬ @nuxt/test-utils 3.14.3

│ ├── ✕ missing peer vite@"\*"

│ └─┬ vitest-environment-nuxt 1.0.1

│ └─┬ @nuxt/test-utils 3.14.3

│ ├── ✕ missing peer vite@"\*"

│ └─┬ vitest-environment-nuxt 1.0.1

│ └─┬ @nuxt/test-utils 3.14.3

│ └── ✕ missing peer vite@"\*"

├─┬ @unocss/nuxt 0.63.4

│ ├─┬ unocss 0.63.4

│ │ ├── ✕ missing peer vite@"^2.9.0 || ^3.0.0-0 || ^4.0.0 || ^5.0.0-0"

│ │ ├─┬ @unocss/astro 0.63.4

│ │ │ ├── ✕ missing peer vite@"^2.9.0 || ^3.0.0-0 || ^4.0.0 || ^5.0.0-0"

│ │ │ └─┬ @unocss/vite 0.63.4

│ │ │ └── ✕ missing peer vite@"^2.9.0 || ^3.0.0-0 || ^4.0.0 || ^5.0.0-0"

│ │ └─┬ @unocss/vite 0.63.4

│ │ └── ✕ missing peer vite@"^2.9.0 || ^3.0.0-0 || ^4.0.0 || ^5.0.0-0"

│ └─┬ @unocss/vite 0.63.4

│ └── ✕ missing peer vite@"^2.9.0 || ^3.0.0-0 || ^4.0.0 || ^5.0.0-0"

├─┬ unocss 0.63.4

│ └── ✕ missing peer vite@"^2.9.0 || ^3.0.0-0 || ^4.0.0 || ^5.0.0-0"

└─┬ nuxt 3.13.2

└─┬ @nuxt/devtools 1.6.0

├── ✕ missing peer vite@"\*"

├─┬ @vue/devtools-core 7.4.4

│ └── ✕ missing peer vite@"^2.6.0 || ^3.0.0 || ^4.0.0 || ^5.0.0-0"

├─┬ @nuxt/devtools-kit 1.6.0

│ └── ✕ missing peer vite@"\*"

├─┬ vite-plugin-inspect 0.8.7

│ └── ✕ missing peer vite@"^3.1.0 || ^4.0.0 || ^5.0.0-0"

└─┬ vite-plugin-vue-inspector 5.1.3

└── ✕ missing peer vite@"^3.0.0-0 || ^4.0.0-0 || ^5.0.0-0"

✕ Conflicting peer dependencies:

vite