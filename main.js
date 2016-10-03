'use strict'

/* ----- Global variables ----- */
const path = require('path')
const CONSTS = require('./js/constants.js')
const {
  app,
  Menu,
  Tray,
  BrowserWindow,
  globalShortcut
} = require('electron')
const reload = require('electron-reload')
reload(__dirname, {electron: require('electron')})
const Config = require('electron-config')
const config = new Config()

let isSearchWindowFocused = false
let tray = null
// TODO: Add all windows into an array?
let searchWindow = null
let settingsWindow = null

/* ----- App events ----- */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // macOS
    app.quit()
  }
})

app.on('ready', () => {
  app.dock.hide()
  config.set(CONSTS.CONFIG_USER_INPUT, '') // Clear last user's search input
  config.set(CONSTS.CONFIG_SEARCH_WINDOW_LAST_BOUNDS, '') // Clear last search window bounds on new start

  let trayIconPath = path.join(__dirname, 'img', 'icon.png')
  tray = new Tray(trayIconPath)
  const contextMenu = Menu.buildFromTemplate([
    {click: openSearchWindow, label: 'Search'},
    {click: openSettingsWindow, label: 'Settings'},
    {label: 'Quit', role: 'quit'}
  ])
  tray.setContextMenu(contextMenu)

  const searchShortcut = globalShortcut.register('CommandOrControl+Shift+Space', () => {
    if (!isSearchWindowFocused) {
      openSearchWindow()
      // Set search window to latest bounds
      let lastBounds = config.get(CONSTS.CONFIG_SEARCH_WINDOW_LAST_BOUNDS)
      if (lastBounds && lastBounds.width !== 0 && lastBounds.height !== 0) {
        searchWindow.setBounds(lastBounds)
      }
    } else {
      config.set(CONSTS.CONFIG_SEARCH_WINDOW_LAST_BOUNDS, searchWindow.getBounds())
      searchWindow.close()
    }
  })
  if (!searchShortcut) {
    console.warn('Warning: Could not register shortcut for fast search')
  }
})

app.on('will-quit', () => { globalShortcut.unregisterAll() })

/* ----- Functions ----- */
function openSearchWindow () {
  let searchWindowOptions = {
    width: CONSTS.SEARCH_WINDOW_WIDTH,
    height: CONSTS.SEARCH_WINDOW_HEIGHT,
    /* maxHeight: CONSTS.SEARCH_WINDOW_MAX_HEIGHT, */
    resizable: true,
    frame: false,
    alwaysOnTop: true,
    show: false
  }
  searchWindow = new BrowserWindow(searchWindowOptions)
  searchWindow.loadURL(`file://${__dirname}/html/index.html`)

  searchWindow.once('ready-to-show', () => {
    isSearchWindowFocused = true
    searchWindow.show()
  })
  searchWindow.on('blur', () => {
    searchWindow.close()
  })
  searchWindow.on('close', () => {
    isSearchWindowFocused = false
    globalShortcut.unregister('Escape')
    app.hide() // Workaround when search window is closed so last app user used gets focused
  })
  searchWindow.on('closed', () => { searchWindow = null })

  // Register escape shortcut
  const escSearchShortcut = globalShortcut.register('Escape', () => {
    searchWindow.close()
  })
  if (!escSearchShortcut) {
    console.warn('Warning: Could not register escape shortcut for fast search')
  }
}

function openSettingsWindow () {
  let settingsWindowOptions = {
    width: 400,
    height: 200,
    resizable: true,
    show: false
  }
  settingsWindow = new BrowserWindow(settingsWindowOptions)
  settingsWindow.loadURL(`file://${__dirname}/html/settings.html`)

  settingsWindow.on('ready-to-show', () => { settingsWindow.show() })
  settingsWindow.on('closed', () => { settingsWindow = null })
}
