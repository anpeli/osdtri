<template>
  <section class="posts">
    <div class="section-heading">
      <h2>{{ archive ? 'Inläggsarkiv' : 'Senaste inläggen' }}</h2>
      <p v-if="!archive">Nyheter och berättelser från Östersund Triathlon.</p>
    </div>

    <div
      v-if="posts.length"
      ref="postList"
      class="post-list"
      @click="openPostImage"
      @keydown.enter="openPostImage"
      @keydown.space="openPostImage"
    >
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :link-title="true"
      />
    </div>

    <p v-else class="no-posts">{{ archive ? 'Inga äldre inlägg att visa.' : 'Inga inlägg publicerade ännu.' }}</p>
    <ImageDialog ref="postImageDialog" />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { marked } from 'marked'
import ImageDialog from './ImageDialog.vue'
import PostCard from './PostCard.vue'
import { getPostGroups } from '../utils/postGroups'

const postList = ref(null)
const postImageDialog = ref(null)

const props = defineProps({
  archive: {
    type: Boolean,
    default: false
  }
})

const parseFrontMatter = (source) => {
  const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const metadata = {}

  if (frontMatterMatch) {
    frontMatterMatch[1].split(/\r?\n/).forEach((line) => {
      const separator = line.indexOf(':')
      if (separator === -1) return

      const key = line.slice(0, separator).trim()
      const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
      metadata[key] = value
    })
  }

  return { metadata, body: frontMatterMatch ? frontMatterMatch[2] : source }
}

const postFiles = import.meta.glob('../content/posts/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const parsePost = (source, id) => {
  const { metadata, body } = parseFrontMatter(source)

  return {
    id,
    slug: id.split('/').pop().replace(/\.md$/, ''),
    title: metadata.title || 'Namnlöst inlägg',
    date: metadata.date || '',
    author: metadata.author || '',
    body: marked.parse(body, { breaks: true })
  }
}

const postGroups = getPostGroups(
  Object.entries(postFiles).map(([id, source]) => parsePost(source, id))
)
const posts = props.archive ? postGroups.archivePosts : postGroups.homePosts

const openPostImage = (event) => {
  const target = event.target
  if (!(target instanceof Element)) return

  const image = target.closest('img') || target.closest('a')?.querySelector('img')
  if (!image) return
  if (event.type === 'keydown') event.preventDefault()

  const post = image.closest('.post-card')
  if (!post) return

  const link = image.closest('a')
  if (link) event.preventDefault()

  const postTitle = post.querySelector('h3')?.textContent || ''
  const postImages = [...post.querySelectorAll('img')].map((postImage) => {
    const imageLink = postImage.closest('a')
    return {
      src: imageLink?.href || postImage.currentSrc || postImage.src,
      alt: postImage.alt || postTitle
    }
  })
  const index = [...post.querySelectorAll('img')].indexOf(image)
  postImageDialog.value?.open(postImages, index)
}

onMounted(() => {
  postList.value?.querySelectorAll('.post-card img').forEach((image) => {
    if (!image.closest('a')) {
      image.tabIndex = 0
      image.setAttribute('role', 'button')
    }
    image.setAttribute('aria-label', `Visa större: ${image.alt}`)
  })
})

</script>

<style scoped>
.posts {
  max-width: 800px;
  margin: 4rem auto;
  padding: 0 2rem;
}

.section-heading {
  margin-bottom: 2rem;
}

.section-heading h2 {
  margin-bottom: 0.5rem;
  color: var(--club-charcoal);
  border-left: 5px solid var(--club-lime);
  padding-left: 0.75rem;
}

.no-posts {
  color: var(--club-muted);
}

.section-heading p {
  max-width: 38rem;
  margin-left: 0.75rem;
  color: var(--club-ink);
  font-size: 1.05rem;
  line-height: 1.65;
}

.post-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

</style>
