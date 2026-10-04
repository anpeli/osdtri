export const getPostGroups = (posts) => {
  const allPosts = [...posts]
    .sort((first, second) => new Date(second.date) - new Date(first.date))

  const sixMonthsAgo = new Date()
  const currentDay = sixMonthsAgo.getDate()
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  sixMonthsAgo.setDate(Math.min(
    currentDay,
    new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + 1, 0).getDate()
  ))

  const recentPosts = allPosts.filter((post) => new Date(post.date) >= sixMonthsAgo)
  const olderPosts = allPosts.filter((post) => new Date(post.date) < sixMonthsAgo)
  const homePosts = [...recentPosts, ...olderPosts.slice(0, Math.max(0, 3 - recentPosts.length))]
  const homePostIds = new Set(homePosts.map((post) => post.id))

  return {
    allPosts,
    homePosts,
    archivePosts: allPosts.filter((post) => !homePostIds.has(post.id))
  }
}
