'use strict'

/* var { shell } = require('electron') TODO: COMMENTED BECAUSE NO SIDE BAR */
var CONSTS = require('../js/constants.js') // Current pathname is in html folder
var Config = require('electron-config')
var config = new Config()

$(function () {
  /*
  TODO: COMMENTED BECAUSE NO SIDE BAR
  let viewToShow = config.get(CONSTS.CONFIG_VIEW_TYPE)
  switch (viewToShow) {
    case CONSTS.CONFIG_VIEW.SEARCH:
      $('#search-button').addClass('active')
      $('#search').prop('checked', true)
      break
    case CONSTS.CONFIG_VIEW.STARRED:
      $('#starred-button').addClass('active')
      $('#starred').prop('checked', true)
      break
    case CONSTS.CONFIG_VIEW.SETTINGS:
      $('#settings-button').addClass('active')
      $('#settings').prop('checked', true)
      break
    case CONSTS.CONFIG_VIEW.INFO:
      $('#info-button').addClass('active')
      $('#info').prop('checked', true)
      break
  }
  */

  // Check on start
  loadSearchView()

  /*
  TODO: COMMENTED BECAUSE NO SIDE BAR
  if ($('#search').is(':checked')) {
    config.set(CONSTS.CONFIG_VIEW_TYPE, CONSTS.CONFIG_VIEW.SEARCH)
    loadSearchView()
  } else if ($('#starred').is(':checked')) {
    config.set(CONSTS.CONFIG_VIEW_TYPE, CONSTS.CONFIG_VIEW.STARRED)
    loadStarredView()
  } else if ($('#settings').is(':checked')) {
    config.set(CONSTS.CONFIG_VIEW_TYPE, CONSTS.CONFIG_VIEW.SETTINGS)
    loadSettingsView()
  } else if ($('#info').is(':checked')) {
    console.log('WANT TO SHOW INFO')
    config.set(CONSTS.CONFIG_VIEW_TYPE, CONSTS.CONFIG_VIEW.INFO)
    loadInfoView()
  }

  // Events when side button clicked
  $('#search-button').click(() => {
    let searchInputEl = $(this).find('#search')
    if (!$(searchInputEl).is(':checked')) {
      config.set(CONSTS.CONFIG_VIEW_TYPE, CONSTS.CONFIG_VIEW.SEARCH)
      loadSearchView()
    }
  })
  $('#starred-button').click(() => {
    let starredInputEl = $(this).find('#starred')
    if (!$(starredInputEl).is(':checked')) {
      config.set(CONSTS.CONFIG_VIEW_TYPE, CONSTS.CONFIG_VIEW.STARRED)
      loadStarredView()
    }
  })
  $('#settings-button').click(() => {
    let settingsInputEl = $(this).find('#settings')
    if (!$(settingsInputEl).is(':checked')) {
      config.set(CONSTS.CONFIG_VIEW_TYPE, CONSTS.CONFIG_VIEW.SETTINGS)
      loadSettingsView()
    }
  })
  $('#info-button').click(() => {
    let infoInputEl = $(this).find('#info')
    if (!$(infoInputEl).is(':checked')) {
      config.set(CONSTS.CONFIG_VIEW_TYPE, CONSTS.CONFIG_VIEW.INFO)
      loadInfoView()
    }
  })
*/
})

function loadSearchView () {
  $('.view').empty()
  let searchViewBaseHTML = '<div class="row">' +
                            '<div class="col-lg-12 search">' +
                              '<input id="search-input" type="text" class="form-control input-lg" placeholder="Search StackOverflow" autofocus/>' +
                            '</div>' + // Close "col-lg-12" and "search"
                           '</div>' // Close "row"
  searchViewBaseHTML += '<div id="spinner-row"></div>'
  /* searchViewBaseHTML += '<div class="questions pre-scrollable"></div>' */
  searchViewBaseHTML += '<div class="questions"></div>'
  /* searchViewBaseHTML += '<div class="answers pre-scrollable"></div>' */
  searchViewBaseHTML += '<div class="answers"></div>'
  // Load logic for the search view
  searchViewBaseHTML += '<script src="../js/search.js"></script>'
  $('.view').append(searchViewBaseHTML)
}

/*
TODO: COMMENTED BECAUSE NO SIDE BAR
function loadStarredView () {
  $('.view').empty()
  let starredViewBaseHTML = '<div class="row text-center">' +
                            '<div class="col-lg-12">' +
                              '<h3>Work in progress...</h3>' +
                            '</div>' + // Close "col-lg-12"
                          '</div>' // Close "row"
  starredViewBaseHTML += '<div id="gif"></div>'
  $('.view').append(starredViewBaseHTML)
}

function loadSettingsView () {
  $('.view').empty()
  let settingsViewBaseHTML = '<div class="row text-center">' +
                              '<div class="col-lg-12">' +
                                '<h3>Work in progress...</h3>' +
                              '</div>' + // Close "col-lg-12"
                            '</div>' // Close "row"
  settingsViewBaseHTML += '<div id="gif"></div>'
  $('.view').append(settingsViewBaseHTML)
}

function loadInfoView () {
  $('.view').empty()
  let infoViewBaseHTML = '<div class="row text-center">' +
                            '<div class="col-lg-12">' +
                              '<h3>Developer\'s assistent. Temporary named Nikki.</h3>' +
                              '<h5>Here to make your coding life easier, very early build.</h5>' +
                              '<p>Created by <a id="link" href="https://twitter.com/mlejva">Vaclav Mlejnsky</a></p>' +
                            '</div>' + // Close "col-lg-12"
                          '</div>' // Close "row"
  $('.view').append(infoViewBaseHTML)
  // Open link in default browser
  let link = $('#link')
  link.click((event) => {
    event.preventDefault()
    shell.openExternal(link.attr('href'))
  })
}
*/
