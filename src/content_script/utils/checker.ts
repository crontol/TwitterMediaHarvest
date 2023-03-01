import select from 'select-dom'

export const isArticleInDetail = (article: HTMLElement) =>
  select.exists('.tweet-detail', article)

/**
 * <article role="article" data-focusable="true" tabindex="0" class="css-1dbjc4n r-18u37iz r-1ny4l3l r-1udh08x r-1yt7n81 r-ry3cjt">
 *
 * @param {HTMLElement} article
 */
export const isArticleInStatus = (article: HTMLElement) => {
  const articleClassLength = article.classList.length
  const isMagicLength =
    articleClassLength === 3 ||
    articleClassLength === 7 ||
    articleClassLength === 6
  const testStatus = /^.*\/\/.*twitter.com\/.*\/status\/\d+.*(?<!photo\/\d)$/
  const url = window.location.href

  return Boolean(url.match(testStatus)) && isMagicLength
}

/**
 * !! CAUTION: This function relied on magic number
 * <article role="article" data-focusable="true" tabindex="0" class="css-1dbjc4n r-1loqt21 r-18u37iz r-1ny4l3l r-1udh08x r-1yt7n81 r-ry3cjt r-o7ynqc r-6416eg">
 *
 * @param {HTMLElement} article
 */
export const isArticleInStream = (article: HTMLElement) => {
  const articleClassLength = article.classList.length
  return (
    articleClassLength === 5 ||
    articleClassLength === 9 ||
    articleClassLength === 10
  )
}

/**
 * @param {HTMLElement} article
 */
export const isArticlePhotoMode = (article: HTMLElement) =>
  article instanceof HTMLDivElement

/**
 * @param {HTMLElement} article
 */
export const checkModeOfArticle = (article: HTMLElement): TweetMode => {
  if (isArticlePhotoMode(article)) return 'photo'
  if (isArticleInStatus(article)) return 'status'
  return 'stream'
}

/**
 * @param {ParentNode} article This should be article.
 */
export const articleHasMedia = (article: HTMLElement) => {
  if (!article) return false
  const hasPhoto = select.exists(
    '[data-testid="tweetPhoto"]',
    article
  )
  const hasVideo = (select.exists('[role="progressbar"]', article)
    || select.exists('[data-testid="videoPlayer"]', article))

  return hasVideo || hasPhoto
}

/**
 * @param {HTMLElement} article
 */
export const isArticleCanBeAppend = (article: HTMLElement) => isTweetDeck()
  ? !select.exists('.deck-harvester', article)
  : !select.exists('.harvester', article)

export const isStreamLoaded = () =>
  select.exists('[role="region"]') && select.exists('article')

const fetchHost = (): string => window.location.host
/**
 * Check current page is in tweetdeck or not.
 * @returns {boolean}
 */
export const isTweetDeck = (): boolean =>
  fetchHost() === 'tweetdeck.twitter.com'

/**
 * Check current page is in twitter or not.
 * @returns {boolean}
 */
export const isTwitter = (): boolean => {
  const host = fetchHost()
  return host === 'twitter.com' || host === 'mobile.twitter.com'
}

/**
 * Check user is composing tweet or not.
 * @returns {boolean}
 */
export const isComposingTweet = (): boolean =>
  Boolean(window.location.pathname.match(/\/compose\/tweet\/?.*/)) ||
  Boolean(window.location.pathname.match(/\/intent\/tweet\/?.*/))

export const isNotFunctionPath = (): boolean =>
  Boolean(window.location.pathname.match(/\/i\/lists\/add_member/))

export const isInTweetStatus = (): boolean => Boolean(window.location.pathname.match(/\/status\//))
