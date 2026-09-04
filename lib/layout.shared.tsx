import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Shared layout configuration for the site (nav, links, etc.)
 * Reused by both the home page and the docs layout.
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Playbook',
    },
    links: [
      {
        text: 'Docs',
        url: '/docs',
      },
    ],
  };
}
