'use strict'

/* ----- Global variables ----- */
// Properties must be "var" instead of "constants" because
// script can be loaded multiple times through side buttons
const CONSTS = require('../js/constants.js') // Current pathname is in html folder
const Config = require('electron-config')
const config = new Config()
const { shell } = require('electron')
let isDraggingSlider = false

let questionsIDs = []
let selectedQuestionIndex = 0
// let newQEl = document.registerElement('question-element', QuestionElement)
/* ----- jQuery ready function ----- */
$(function () {
  let searchInput = $('#search-input')
  let lastSearchInput = config.get(CONSTS.CONFIG_USER_INPUT)
  searchInput.val(lastSearchInput)

  if (searchInput.val()) {
    //windowFullSize()
    searchInput.select()
    restoreLastSession()

    // TODO
    // Enable navigation using up & down key arrows
    // enableNavigationThroughElements('question', false)
    /*
    let selectedQuestionID = config.get(CONSTS.CONFIG_SELECTED_QUESTION)
    if (selectedQuestionID) {
      selectQuestion(selectedQuestionID)
      let question = $(`#${selectedQuestionID}`).data('question')
      showAnswers(config.get(CONSTS.CONFIG_SELECTED_QUESTION_ANSWERS), question)
      let scrollBarPosition = config.get(CONSTS.CONFIG_ANSWERS_SCROLL_TOP)
      $('.answers').scrollTop(scrollBarPosition)

      let sliderPosX = config.get(CONSTS.CONFIG_SLIDER_POSITION_X)
      let lastBounds = config.get(CONSTS.CONFIG_SEARCH_WINDOW_LAST_BOUNDS)
      updateLayout(sliderPosX, lastBounds.width)
    }
    */
  }


/* Event handlers */
  $(window).keydown((e) => {
    if (e.which === CONSTS.ARROW_DOWN_KEYCODE || e.which === CONSTS.ARROW_UP_KEYCODE) {
      e.preventDefault()

      if ($('so-question[selected]').length === 0) {
        selectFirstQuestion()
      } else {
        if (e.which === CONSTS.ARROW_UP_KEYCODE) {
          selectPreviousQuestion()
        } else { // down arrow
          selectNextQuestion()
        }
      }
      
      scrollIfQuestionNotVisible()
    }
  })

  searchInput.on('input', () => {
    config.set(CONSTS.CONFIG_USER_INPUT, searchInput.val()) // TODO: Should set only when window is about to be closed
  })

  searchInput.keydown((e) => {
    if (e.which === CONSTS.ARROW_DOWN_KEYCODE || e.which === CONSTS.ARROW_UP_KEYCODE) {
      e.preventDefault()
    }
    if (e.which === CONSTS.ENTER_KEYCODE) { // User pressed enter
      clearView()

      if (searchInput.val()) {
        // windowFullSize()
        searchStackOverflow(searchInput.val(), () => {
          // TODO
          // Enable navigation using up & down key arrows
          // enableNavigationThroughElements('question', true)

          let sliderPosX = config.get(CONSTS.CONFIG_SLIDER_POSITION_X)
          updateLayout(sliderPosX)
        })
      } else {
        windowFullSize()
        hideSlider()
      }
    }
  })

  $('.answers').scroll(() => {
    config.set(CONSTS.CONFIG_ANSWERS_SCROLL_TOP, $('.answers').scrollTop())
  })

  $('.slider').mousedown((e) => {
    isDraggingSlider = true
    e.preventDefault()
  })

  $(document)
  .mouseup(() => {
    isDraggingSlider = false
    let sliderPosX = $('.slider').offset().left
    config.set(CONSTS.CONFIG_SLIDER_POSITION_X, sliderPosX)
  })
  .mousemove((e) => {
    if (isDraggingSlider) {
      updateLayout(e.pageX)
    }
  })
})
/* ---------- */

/* ----- Functions ----- */
function selectFirstQuestion () {
  let soQuestions = $('so-question')
  soQuestions[0].selected = true
}

function selectNextQuestion () {
  let selectedQuestions = $('so-question[selected]')

  if (selectedQuestions.length !== 0)
    selectedQuestions[0].selected = false

  if (selectedQuestions.next().length === 0) {
    selectedQuestions.siblings().first()[0].selected = true
  } else {
    selectedQuestions.next()[0].selected = true
  }
}

function selectPreviousQuestion () {
  let selectedQuestions = $('so-question[selected]')

  if (selectedQuestions.length !== 0)
    selectedQuestions[0].selected = false

  if (selectedQuestions.prev().length === 0) {
    selectedQuestions.siblings().last()[0].selected = true
  } else {
    selectedQuestions.prev()[0].selected = true
  }
}

function restoreLastSession () {
  const savedQuestions = loadSavedQuestions()
  for (let q of savedQuestions) {
    let soQuestion = document.createElement('so-question')
    soQuestion.answered = q.answered
    soQuestion.title = q.title
    soQuestion.body = q.body
    soQuestion.id = q.id
    soQuestion.link = q.link

    document.getElementById('questions-list').appendChild(soQuestion)
  }
  // TODO: Select last selected question

  let sliderPosX = config.get(CONSTS.CONFIG_SLIDER_POSITION_X)
  updateLayout(sliderPosX)
}

function loadSavedQuestions () {
  return config.get(CONSTS.CONFIG_QUESTIONS)
}

function saveQuestions (questionsSaveObjects) {
  config.set(CONSTS.CONFIG_QUESTIONS, questionsSaveObjects)
}

function searchStackOverflow (userInput, callback) {
  // windowFullSize()
  $('.loading-center').append(CONSTS.LOADING_INDICATOR_HTML)

  let jsonHTML = CONSTS.SO_SEARCH_QUESTIONS_API + `&q=${encodeURIComponent(userInput)}`
  $.getJSON(jsonHTML, (data) => {
    let items = data.items
    let questionsSaveObjects = [] // Because DOM elements cannot be converted to JSON
    $.each(items, (key, q) => {
      let soQuestion = document.createElement('so-question')

      $.each(q, (key, value) => {
        switch (key) {
          case CONSTS.SO_QUESTION_IS_ANSWERED_JSON_KEY:
            soQuestion.answered = value
            break
          case CONSTS.SO_QUESTION_TITLE_JSON_KEY:
            soQuestion.title = decodeHTML(value)
            break
          case CONSTS.SO_QUESTION_BODY_JSON_KEY:
            soQuestion.body = decodeHTML(value)
            break
          case CONSTS.SO_QUESTION_ID_JSON_KEY:
            soQuestion.id = value
            break
          case CONSTS.SO_QUESTION_LINK_JSON_KEY:
            soQuestion.link = decodeHTML(value)
            break
        }
      })
      // Prepare soQuestion data for saving
      const questionSaveObject = {
        answered: soQuestion.answered,
        title: soQuestion.title,
        body: soQuestion.body,
        id: soQuestion.id,
        link: soQuestion.link
      }
      questionsSaveObjects.push(questionSaveObject)

      document.getElementById('questions-list').appendChild(soQuestion)
    })
    saveQuestions(questionsSaveObjects)
  })
  .done(() => {
    $('.loading-center').empty()
    callback()
  })
  .fail((jqXHR, status, error) => {
    clearView()
    $('.questions').append(error)
    console.log(`Error while trying to get SO questions - ${error}`)
  })
}

function windowFullSize () {
  /*
  let lastBounds = config.get(CONSTS.CONFIG_SEARCH_WINDOW_LAST_BOUNDS)
  if (lastBounds && lastBounds.width !== 0 && lastBounds.height !== 0) {
    window.resizeTo(lastBounds.width, lastBounds.height)
  } else {
    window.resizeTo(CONSTS.SEARCH_WINDOW_WIDTH, CONSTS.SEARCH_WINDOW_HEIGHT)
  }
  */
}

function scrollIfQuestionNotVisible () {
  let selectedQ = $('so-question[selected]')

  if (!isElementInView(selectedQ, true)) {
    let qs = $('.questions')
    qs.animate({
      scrollTop: qs.scrollTop() + selectedQ.position().top
    }, 0)
  }
}

function isElementInView (element, fullyInView) {
  let pageTop = $(window).scrollTop()
  let pageBottom = pageTop + $(window).height()
  let elementTop = $(element).offset().top
  let elementBottom = elementTop + $(element).height()

  if (fullyInView) {
    return ((pageTop < elementTop) && (pageBottom > elementBottom))
  } else {
    return ((elementBottom <= pageBottom) && (elementTop >= pageTop))
  }
}

function clearView () {
  $('.loading-center').empty()
  $('.questions').empty()
  $('.questions-list').empty()
  $('.answers').empty()
  $('.answers-list').empty()
  hideSlider()
}

function updateLayout (sliderX, bodyWidth) {
  const sliderOffset = 8
  const sliderMin = 20
  const sliderMax = 80

  let slider = $('.slider')
  let left = $('.questions')
  let right = $('.answers')
  if (!bodyWidth && bodyWidth !== 0) {
    bodyWidth = $('body').width()
  }

  if (slider.css('visibility') !== 'visible') {
    slider.css('visibility', 'visible')
  }

  let sliderPercent = ((sliderX - sliderOffset) / bodyWidth) * 100
  if (sliderPercent <= sliderMin) {
    sliderPercent = sliderMin
  } else if (sliderPercent >= sliderMax) {
    sliderPercent = sliderMax
  }

  let leftPercent = sliderPercent + (sliderOffset / bodyWidth) * 100
  let rightPercent = 100 - leftPercent

  slider.css('left', `${sliderPercent}%`)
  left.css('width', `${leftPercent}%`)
  right.css('width', `${rightPercent}%`)
}

function hideSlider () {
  $('.slider').css('visibility', 'hidden')
}

function decodeHTML(encoded) {
  return $("<textarea/>").html(encoded).text()
}
