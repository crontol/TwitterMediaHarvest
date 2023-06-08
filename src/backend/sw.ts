/* eslint-disable no-console */
import { addBreadcrumb, init as SentryInit, setUser as SentrySetUser, type User } from '@sentry/browser'
import browser from 'webextension-polyfill'
import { Action } from '../typings'
import { ClientInfoUseCase } from './client/useCases'
import { showUpdateMessageInConsole } from './commands/console'
import { initStorage, MigrateStorageToV4 } from './commands/storage'
import { storageConfig } from './configurations'
import DownloadActionUseCase from './downloads/downloadActionUseCase'
import DownloadStateUseCase from './downloads/downloadStateUseCase'
import { HarvestError } from './errors'
import { chromiumInit, firefoxInit } from './initialization'
import NotificationUseCase from './notifications/notificationIdUseCase'
import { V4StatsUseCase } from './statistics/useCases'
import { isDownloadedBySelf, isInvalidInfo } from './utils/checker'

interface SentryUser extends User {
  client_id: string
}

const enum InstallReason {
  Install = 'install',
  Update = 'update',
  BrowserUpdate = 'browser_update',
}

SentryInit({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.3 : 0.8,
  environment: process.env.NODE_ENV,
  release: process.env.RELEASE,
  ignoreErrors: ['Failed to fetch'],
  beforeSend: async (event, hint) => {
    const credential = await storageConfig.credentialsRepo.getCredential()
    const clientInfo = await storageConfig.clientInfoRepo.getInfo()
    const sentryUser: SentryUser = {
      id: credential.identityId,
      client_id: clientInfo.props.uuid,
    }
    SentrySetUser(sentryUser)
    return event
  },
})

browser.runtime.onMessage.addListener(async (message: HarvestMessage, sender, sendResponse) => {
  if (message.action === Action.Download) {
    if (isInvalidInfo(message.data)) {
      console.error('Invalid tweetInfo.')
      return {
        status: 'error',
        data: new HarvestError(`Invalid tweetInfo. ${message.data}`),
      }
    }

    const usecase = new DownloadActionUseCase(message.data as TweetInfo)
    try {
      await usecase.processDownload()
      return { status: 'success' }
    } catch (error) {
      return { status: 'error', data: error }
    }
  }

  sendResponse()

  return {
    status: 'error',
    data: new HarvestError(`Invalid message. ${message}`),
  }
})

browser.runtime.onInstalled.addListener(async details => {
  // TODO: set uninstall url.
  await storageConfig.credentialsRepo.getCredential()
  await storageConfig.clientInfoRepo.getInfo()

  if (details.reason === InstallReason.BrowserUpdate) return

  if (details.reason === InstallReason.Install) {
    await initStorage()
  }

  if (details.reason === InstallReason.Update) {
    const statsUseCase = new V4StatsUseCase(storageConfig.statisticsRepo)
    await statsUseCase.syncWithDownloadHistory()
    const migrateCommand = new MigrateStorageToV4()
    await migrateCommand.execute()
    showUpdateMessageInConsole(details.previousVersion)
  }
})

browser.downloads.onChanged.addListener(async downloadDelta => {
  if (!(await isDownloadedBySelf(downloadDelta.id))) return false

  addBreadcrumb({
    category: 'download',
    message: `Download state changed. (delta: ${downloadDelta})`,
    level: 'info',
  })

  if ('state' in downloadDelta) {
    const downloadStateUseCase = new DownloadStateUseCase(downloadDelta, storageConfig.downloadRecordRepo)
    const clientInfoUseCase = new ClientInfoUseCase(storageConfig.clientInfoRepo)
    await downloadStateUseCase.process()
    await clientInfoUseCase.sync()
  }
})

browser.notifications.onClosed.addListener(notifficationId => {
  const notificationUseCase = new NotificationUseCase(notifficationId)
  notificationUseCase.handle_close()
})

browser.notifications.onClicked.addListener(notifficationId => {
  const notificationUseCase = new NotificationUseCase(notifficationId)
  notificationUseCase.handle_click()
})

browser.notifications.onButtonClicked.addListener((notifficationId, buttonIndex) => {
  const notificationUseCase = new NotificationUseCase(notifficationId)
  notificationUseCase.handle_button(buttonIndex)
})

process.env.TARGET === 'firefox'
  ? firefoxInit()
  : chromiumInit(storageConfig.downloadSettingsRepo, storageConfig.downloadRecordRepo)
