/**
 * @type {Enumerator<chrome.storage.StorageArea>}
 */
const storageArea = Object.freeze({
  sync: chrome.storage.sync,
  local: chrome.storage.local,
})

/**
 * Fetch data from chrome storage.
 * Passing null keys to get all storage item.
 *
 * @param {chrome.storage.StorageArea} storageArea
 * @returns {(keys: string | string[] | Object | null) => Promise<{[key: string]: Object}}
 */
const storageFetcher = storageArea => {
  return (keys = null) => {
    return new Promise(resolve => {
      storageArea.get(keys, items => resolve(items))
    })
  }
}

/**
 * Set data to chrome storage.
 *
 * @param {chrome.storage.StorageArea} storageArea
 * @returns {(items: string | number | Object[] | Object) => Promise<void>}
 */
const storageSetter = storageArea => items => {
  return new Promise(resolve => {
    storageArea.set(items, () => resolve())
  })
}

const removerKeysPretreat = keys => {
  if (typeof keys !== 'string') keys = String(keys)
  if (Array.isArray(keys)) keys.map(String)

  return keys
}

/**
 * @param {chrome.storage.StorageArea} storageArea
 * @returns { (removerKeys: string | string[] | number) => Promise<void> }
 */
const storageRemover = storageArea => removerKeys => {
  removerKeys = removerKeysPretreat(removerKeys)

  return new Promise(resolve => {
    storageArea.remove(removerKeys, resolve)
  })
}

/**
 * @param {chrome.storage.StorageArea} storageArea
 * @returns { Promise<void> }
 */
const storageCleaner = storageArea => () => {
  return new Promise(resolve => {
    storageArea.clear(() => resolve())
  })
}

/**
 * Fetch chrome cookie
 *
 * @async
 * @param {Object} target
 * @returns { Promise<chrome.cookies.Cookie }
 */
export const fetchCookie = target =>
  new Promise(resolve => {
    chrome.cookies.get(target, cookie => resolve(cookie))
  })

/**
 * Search browser download history with query.
 *
 * @param {chrome.downloads.DownloadQuery} query
 * @returns { Promise<chrome.downloads.DownloadItem[]> }
 */
export const searchDownload = async query => {
  return new Promise(resolve => {
    chrome.downloads.search(query, items => resolve(items))
  })
}
const langMapping = {
  en: {
    appName: {
      message: 'Media Harvest : twitter Media Downloader',
    },
    appDesc: {
      message:
        'Download videos and images from twitter or TweetDeck with only one click.',
    },
    downloadsDirectoryLabel: {
      message: 'Downloads directory',
    },
    downloadsDirectoryHelp: {
      message: 'This directory is invalid',
    },
    filenamePatternLabel: {
      message: 'Filename pattern',
    },
    filenamePatternAccount: {
      message: 'Account',
    },
    filenameSerialStyleLabel: {
      message: 'Serial style',
    },
    filenameSerialStyleFileOrder: {
      message: 'file order',
    },
    filenameSerialStyleFileName: {
      message: 'file name',
    },
    filenamePreviewLabel: {
      message: 'Preview',
    },
    submitButtonText: {
      message: 'Save',
    },
    submitButtonSuccessText: {
      message: 'Success',
    },
    notificationDLFailedTitle: {
      message: 'Download failed',
    },
    notificationDLFailedMessageFirst: {
      message: 'Media in ',
    },
    notificationDLFailedMessageLast: {
      message: ' download failed.',
    },
    notificationDLFailedButton1: {
      message: 'View',
    },
    notificationDLFailedButton2: {
      message: 'Retry',
    },
    fetchFailedTooManyRequestsTitle: {
      message: 'Too many requests.',
    },
    fetchFailedTooManyRequestsMessage: {
      message: 'Please wait for a while.',
    },
    fetchFailedUnknownTitle: {
      message: 'Unknown Error:',
    },
    fetchFailedUnknownMessage: {
      message: 'Please contact with developer.',
    },
    noSubDirectory: {
      // eslint-disable-next-line quotes
      message: "Don't create subdirectory.",
    },
  },
  ja: {
    appName: {
      message: 'Media Harvest : ツイッターメディアダウンローダー',
    },
    appDesc: {
      message:
        ' twitter や TweetDeck のビデオと画像、ワンクリックでダウンロードできる。',
    },
    downloadsDirectoryLabel: {
      message: '保存先',
    },
    downloadsDirectoryHelp: {
      message: '無効なディレクトリ',
    },
    filenamePatternLabel: {
      message: 'ファイル名仕様',
    },
    filenamePatternAccount: {
      message: 'アカウント',
    },
    filenameSerialStyleLabel: {
      message: 'シリアル番号仕様',
    },
    filenameSerialStyleFileOrder: {
      message: 'ファイル順',
    },
    filenameSerialStyleFileName: {
      message: 'ランダムファイル名',
    },
    filenamePreviewLabel: {
      message: 'プレビュー',
    },
    submitButtonText: {
      message: '保存',
    },
    submitButtonSuccessText: {
      message: '保存成功',
    },
    notificationDLFailedTitle: {
      message: 'ダウンロード失敗しました',
    },
    notificationDLFailedMessageFirst: {
      message: '',
    },
    notificationDLFailedMessageLast: {
      message: ' のメディアがダウンロード失敗しました。',
    },
    notificationDLFailedButton1: {
      message: 'ツイッターへ',
    },
    notificationDLFailedButton2: {
      message: 'やり直し',
    },
    fetchFailedTooManyRequestsTitle: {
      message: 'リクエストが頻繁に行われました',
    },
    fetchFailedTooManyRequestsMessage: {
      message: 'しばらくしてからもう一度お試しください。',
    },
    fetchFailedUnknownTitle: {
      message: '不明なエラー：',
    },
    fetchFailedUnknownMessage: {
      message: '開発者に問い合わせてください。',
    },
    noSubDirectory: {
      message: 'サブディレクトリを作成しません',
    },
  },
  zh: {
    appName: {
      message: 'Media Harvest : twitter 多媒體下載器',
    },
    appDesc: {
      message: '一鍵從 twitter 或 TweetDeck 下載影片和圖片。',
    },
    downloadsDirectoryLabel: {
      message: '下載資料夾',
    },
    downloadsDirectoryHelp: {
      message: '無效的資料夾名稱',
    },
    filenamePatternLabel: {
      message: '檔案名稱樣式',
    },
    filenamePatternAccount: {
      message: '帳號',
    },
    filenameSerialStyleLabel: {
      message: '檔案序號樣式',
    },
    filenameSerialStyleFileOrder: {
      message: '檔案順序',
    },
    filenameSerialStyleFileName: {
      message: '檔案原始名',
    },
    filenamePreviewLabel: {
      message: '預覽',
    },
    submitButtonText: {
      message: '保存',
    },
    submitButtonSuccessText: {
      message: '保存成功',
    },
    notificationDLFailedTitle: {
      message: '下載失敗',
    },
    notificationDLFailedMessageFirst: {
      message: '於 ',
    },
    notificationDLFailedMessageLast: {
      message: ' 的多媒體下載失敗。',
    },
    notificationDLFailedButton1: {
      message: '查看',
    },
    notificationDLFailedButton2: {
      message: '重試',
    },
    fetchFailedTooManyRequestsTitle: {
      message: '短時間發出過多請求',
    },
    fetchFailedTooManyRequestsMessage: {
      message: '請稍等後再試。',
    },
    fetchFailedUnknownTitle: {
      message: '未知錯誤:',
    },
    fetchFailedUnknownMessage: {
      message: '請與開發人員聯絡。',
    },
    noSubDirectory: {
      message: '不新增子資料夾',
    },
  },
}

/**
 * @param {string} kw i18n keyname
 */
export const i18nLocalize = kw => {
  //chrome.i18n.getMessage(kw)
  const userLocale = new Intl.Locale(chrome.i18n.getUILanguage())

  const locale = Object.keys(langMapping).includes(userLocale.language)
    ? langMapping[userLocale.language]
    : langMapping['en']

  return locale[kw]['message']
}
/**
 * @param {string} path url path
 */
export const getExtensionURL = path => chrome.runtime.getURL(path)
export const getExtensionId = () => chrome.runtime.id

export const fetchSyncStorage = storageFetcher(storageArea.sync)
export const fetchLocalStorage = storageFetcher(storageArea.local)
export const setSyncStorage = storageSetter(storageArea.sync)
export const setLocalStorage = storageSetter(storageArea.local)
export const removeFromSyncStorage = storageRemover(storageArea.sync)
export const removeFromLocalStorage = storageRemover(storageArea.local)
export const clearSyncStorage = storageCleaner(storageArea.sync)
export const clearLocalStorage = storageCleaner(storageArea.local)
