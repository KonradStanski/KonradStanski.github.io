import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';
import { POSTS_PATH } from '../utils/mdxUtils';

type PostItem = {
  [key: string]: string;
};

/**
 *
 * @returns List of post slugs based on given path
 */
export function getPostSlugs(): string[] {
  return fs.readdirSync(POSTS_PATH); // TODO: make generic
}

/**
 *
 * @param slug slug for post
 * @param fields Required info to build post
 * @returns Single postitem corresponding to slug
 */
export function getPostBySlug(slug: string, fields: string[] = []): PostItem {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = join(POSTS_PATH, `${realSlug}.mdx`); // TODO: make generic
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items: PostItem = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }
    if (data[field]) {
      items[field] = data[field];
    }
  });

  return items;
}

/**
 *
 * @param fields Required info to build post
 * @returns list of post items
 */
export function getAllPosts(fields: string[] = []): PostItem[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}