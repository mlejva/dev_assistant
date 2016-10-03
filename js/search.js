'use strict'

/* ----- Global variables ----- */
// Properties must be "var" instead of "constants" because
// script can be loaded multiple times through side buttons
const { shell } = require('electron')
let isDraggingSlider = false

let questionsIDs = []
let selectedQuestionIndex = 0
let newQEl = document.registerElement('question-element', QuestionElement)
/* ----- jQuery ready function ----- */
$(function () {
  let searchInput = $('#search-input')
  let lastSearchInput = config.get(CONSTS.CONFIG_USER_INPUT)
  searchInput.val(lastSearchInput)

  if (searchInput.val()) {
    windowFullSize()
    searchInput.select()

    showQuestions(config.get(CONSTS.CONFIG_QUESTIONS))
    // Enable navigation using up & down key arrows
    enableNavigationThroughElements('question', false)

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
    // showAnswers(config.get(CONSTS.CONFIG_ANSWERS))
    /*
    searchStackOverflow(searchInput.val(), (questions) => {
      showQuestions(questions)
    })
    */
  }

  searchInput.on('input', () => {
    config.set(CONSTS.CONFIG_USER_INPUT, searchInput.val()) // TODO: Should set only when window is about to be closed
  })

  searchInput.keydown((e) => {
    if (e.which === CONSTS.ENTER_KEYCODE) { // User pressed enter
      clearView()

      if (searchInput.val()) {
        windowFullSize()
        searchStackOverflow(searchInput.val(), (questions) => {
          config.set(CONSTS.CONFIG_QUESTIONS, questions)
          showQuestions(questions)
          // Enable navigation using up & down key arrows
          enableNavigationThroughElements('question', true)

          let sliderPosX = config.get(CONSTS.CONFIG_SLIDER_POSITION_X)
          updateLayout(sliderPosX)
        })
      } else {
        windowFullSize()
        hideSlider()
      }
    }
  })

  searchInput.keydown((e) => {
    if (e.which === CONSTS.ARROW_DOWN_KEYCODE || e.which === CONSTS.ARROW_UP_KEYCODE) {
      e.preventDefault()
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

/* ----- Functions ----- */
function showQuestions (questions) {
  for (let q of questions) {
    let qHTML = ''
    if (q[CONSTS.SO_QUESTION_IS_ANSWERED_JSON_KEY]) {
      qHTML += `<li id="${q[CONSTS.SO_QUESTION_ID_JSON_KEY]}" class="question answered">`
    } else {
      qHTML += `<li id="${q[CONSTS.SO_QUESTION_ID_JSON_KEY]}" class="question">`
    }
    qHTML += '<div class="row question-title">' +
              '<div class="col-lg-12">' +
                `<h4>${q[CONSTS.SO_QUESTION_TITLE_JSON_KEY]}</h4>` +
              '</div>' + // Close "col-lg-12"
            '</div>' // Close "row" and "question-title"
    qHTML += '<div class="row">' +
              '<div class="col-lg-12">' +
                `<h7>ID: ${q[CONSTS.SO_QUESTION_ID_JSON_KEY]}</h7>` +
              '</div>' + // Close "col-lg-12"
            '</div>' // Close "row" and "question-title"
    qHTML += '<div class="row question-link">' +
              '<div class="col-lg-12">' +
                `<a id="link-${q[CONSTS.SO_QUESTION_ID_JSON_KEY]}" href="${q[CONSTS.SO_QUESTION_LINK_JSON_KEY]}">` +
                  'Open in Browser' +
                '</a>' +
              '</div>' + // Close "col-lg-12"
            '</div>' // Close "row" and "question-link"
    /*
    qHTML += '<div class="row question-body">' +
              '<div class="col-lg-12">' +
                q[CONSTS.SO_QUESTION_BODY_JSON_KEY] +
              '</div>' + // Close "col-lg-12"
            '</div>' // Close "row"
    */
    qHTML += '</li>' // Close "question"
    $('.questions').append(qHTML)
    $(`#${q[CONSTS.SO_QUESTION_ID_JSON_KEY]}`).data('question', q)

    /* ----- Question events ----- */
    // Open all links in default browser
    let qLinkInDOM = $(`#link-${q[CONSTS.SO_QUESTION_ID_JSON_KEY]}`)
    qLinkInDOM.click((event) => {
      event.preventDefault()
      shell.openExternal(qLinkInDOM.attr('href'))
    })
    let currentQ = $(`#${q[CONSTS.SO_QUESTION_ID_JSON_KEY]}`)
    $(currentQ).click(() => {
      if (!$(currentQ).hasClass('selected')) {
        $('.question').removeClass('selected')
        currentQ.addClass('selected')
        config.set(CONSTS.CONFIG_SELECTED_QUESTION, q[CONSTS.SO_QUESTION_ID_JSON_KEY])
        // scrollIfElementNotVisible('selected')
        $('.answers').empty()
        $('.answers').append(CONSTS.SPINNER_HTML)
        getAnswersToQuestion(q[CONSTS.SO_QUESTION_ID_JSON_KEY], (answers, question) => {
          config.set(CONSTS.CONFIG_SELECTED_QUESTION_ANSWERS, answers)
          showAnswers(answers, question)
        })
      }
    })
  }
}

function showAnswers (answers, question) {
  $('.answers').empty()
  let questionDetailHTML = '<div class="question-detail">' +
                            '<div class="row question-detail-title">' +
                              '<div class="col-lg-12">' +
                                `<h4>Question: ${question[CONSTS.SO_QUESTION_TITLE_JSON_KEY]}</h4>` +
                              '</div>' + // Close "col-lg-12"
                            '</div>' + // Close "row" and "question-detail-title"
                            '<div class="row question-detail-body">' +
                              '<div class="col-lg-12">' +
                                question[CONSTS.SO_QUESTION_BODY_JSON_KEY] +
                              '</div>' + // Close "col-lg-12"
                            '</div>' + // Close "row" and "question-detail-body"
                          '</div>' // Close "question-detail"
  $('.answers').append(questionDetailHTML)

  if (answers.length === 0) {
    let html = '<div class="row text-center">' +
                '<div class="col-lg-12">' +
                  'Question has no answers.' +
                '</div>' + // Close "col-lg-12"
              '</div>' // Close "row"
    $('.answers').append(html)
  } else {
    for (let a of answers) {
      let aHTML = '<li class="answer">'
      if (a[CONSTS.SO_ANSWER_IS_ACCEPTED_JSON_KEY]) {
        aHTML += '<div class="row answer-is-accepted">' +
                  '<div class="col-lg-12">' +
                    'Answer is accepted' +
                  '</div>' + // Close "col-lg-12"
                '</div>' // Close "row"
      } else {
        aHTML += '<div class="row answer-not-accepted">' +
                  '<div class="col-lg-12">' +
                    'Answer is not accepted' +
                  '</div>' + // Close "col-lg-12"
                '</div>' // Close "row"
      }
      aHTML += '<div class="row upvotes">' +
                '<div class="col-lg-12">' +
                  `Upvotes: ${a[CONSTS.SO_ANSWER_SCORE_JSON_KEY]}` +
                '</div>' + // Close "col-lg-12"
              '</div>' // Close "row"
      aHTML += '<div class="row">' +
                '<div class="col-lg-12">' +
                  `${a[CONSTS.SO_ANSWER_BODY_JSON_KEY]}` +
                '</div>' + // Close "col-lg-12"
              '</div>' // Close "row"
      aHTML += '</li>' // Close "answer"
      aHTML += '<hr class="hr-answer">'
      $('.answers').append(aHTML)
    }
  }
}

function getAnswersToQuestion (questionID, callback) {
  let answers = []
  let jsonHTML = CONSTS.SO_ANSWERS_TO_QUESTION_BASE_API + encodeURIComponent(questionID) + CONSTS.SO_ANSWERS_TO_QUESTION_PARAMETERS_API
  $.getJSON(jsonHTML, (data) => {
    let items = data.items
    $.each(items, (key, a) => {
      let answer = {}
      $.each(a, (key, value) => {
        switch (key) {
          case CONSTS.SO_ANSWER_IS_ACCEPTED_JSON_KEY:
            answer[CONSTS.SO_ANSWER_IS_ACCEPTED_JSON_KEY] = value
            break
          case CONSTS.SO_ANSWER_SCORE_JSON_KEY:
            answer[CONSTS.SO_ANSWER_SCORE_JSON_KEY] = value
            break
          case CONSTS.SO_ANSWER_BODY_JSON_KEY:
            answer[CONSTS.SO_ANSWER_BODY_JSON_KEY] = value
            break
          case CONSTS.SO_ANSWER_LINK_JSON_KEY:
            answer[CONSTS.SO_ANSWER_LINK_JSON_KEY] = value
            break
        }
      })
      answers.push(answer)
    })
  })
  .done(() => {
    let question = $(`#${questionID}`).data('question')
    callback(answers, question)
  })
}

function searchStackOverflow (userInput, callback) {
  // windowFullSize()
  $('.spinner').append(CONSTS.SPINNER_HTML)

  let questions = []
  let jsonHTML = CONSTS.SO_SEARCH_QUESTIONS_API + `&q=${encodeURIComponent(userInput)}`
  console.log(jsonHTML)
  $.getJSON(jsonHTML, (data) => {
    let items = data.items
    $.each(items, (key, q) => {
      console.log('Between')
      let questionEl = new newQEl()
      console.log(questionEl)
      let question = {}
      $.each(q, (key, value) => {
        switch (key) {
          case CONSTS.SO_QUESTION_IS_ANSWERED_JSON_KEY:
            question[CONSTS.SO_QUESTION_IS_ANSWERED_JSON_KEY] = value
            break
          case CONSTS.SO_QUESTION_TITLE_JSON_KEY:
            question[CONSTS.SO_QUESTION_TITLE_JSON_KEY] = value
            break
          case CONSTS.SO_QUESTION_BODY_JSON_KEY:
            question[CONSTS.SO_QUESTION_BODY_JSON_KEY] = value
            break
          case CONSTS.SO_QUESTION_ID_JSON_KEY:
            question[CONSTS.SO_QUESTION_ID_JSON_KEY] = value
            break
          case CONSTS.SO_QUESTION_LINK_JSON_KEY:
            question[CONSTS.SO_QUESTION_LINK_JSON_KEY] = value
            break
        }
      })
      questions.push(question)
    })
  })
  .done(() => {
    $('.spinner').empty()
    callback(questions)
  })
  .fail((jqXHR, status, error) => {
    clearView()
    $('.questions').append(error)
  })
}

function windowFullSize () {
  let lastBounds = config.get(CONSTS.CONFIG_SEARCH_WINDOW_LAST_BOUNDS)
  if (lastBounds && lastBounds.width !== 0 && lastBounds.height !== 0) {
    window.resizeTo(lastBounds.width, lastBounds.height)
  } else {
    window.resizeTo(CONSTS.SEARCH_WINDOW_WIDTH, CONSTS.SEARCH_WINDOW_HEIGHT)
  }
}

function enableNavigationThroughElements (elementClass, preselectFirst) {

  /*
  let el = $(`.${elementClass}`)
  let elSelected = null

  if (preselectFirst) {
    elSelected = el.eq(0).addClass('selected')
    $('.answers').empty()
    $('.answers').append(spinnerHTML())
    config.set(CONSTS.CONFIG_SELECTED_QUESTION, el.attr('id'))
    getAnswersToQuestion($(elSelected).attr('id'), (answers, question) => {
      config.set(CONSTS.CONFIG_SELECTED_QUESTION_ANSWERS, answers)
      showAnswers(answers, question)
    })
  }

  $(window).keydown((e) => {
    if (e.which === CONSTS.ARROW_DOWN_KEYCODE) {
      $('#search-input').blur()
      e.preventDefault() // Prevent div scrolling using arrow keys
      elSelected = $('.selected')
      if (elSelected) {
        let next = elSelected.next()
        console.log(next.attr('id'))
        if (next.length > 0) {
          elSelected.removeClass('selected')
          elSelected = next.addClass('selected')
        }
      } else {
        elSelected = el.eq(0).addClass('selected')
      }
    } else if (e.which === CONSTS.ARROW_UP_KEYCODE) {
      $('#search-input').blur()
      e.preventDefault() // Prevent div scrolling using arrow keys
      elSelected = $('.selected')
      if (elSelected) {
        let next = elSelected.prev()
        console.log(next.attr('id'))
        if (next.length > 0) {
          elSelected.removeClass('selected')
          elSelected = next.addClass('selected')
        }
      } else {
        elSelected = el.last().addClass('selected')
      }
    }
    scrollIfElementNotVisible('selected')
    if (e.which === CONSTS.ARROW_DOWN_KEYCODE || e.which === CONSTS.ARROW_UP_KEYCODE) {
      let selectedQuestionID = $('.selected').attr('id')
      config.set(CONSTS.CONFIG_SELECTED_QUESTION, selectedQuestionID)
      $('.answers').empty()
      $('.answers').append(spinnerHTML())
      getAnswersToQuestion(selectedQuestionID, (answers, question) => {
        showAnswers(answers, question)
        config.set(CONSTS.CONFIG_SELECTED_QUESTION_ANSWERS, answers)
      })
    }
  })*/
}

function scrollIfElementNotVisible (className) {
  let element = $(`.${className}`)
  let elID = element.attr('id')
  console.log(elID)
  if (!isElementInView(element, true)) {
    let qs = $('.questions')
    qs.animate({
      scrollTop: qs.scrollTop() + $(`#${elID}`).position().top
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
  $('.spinner').empty()
  $('.questions').empty()
  $('.answers').empty()
  hideSlider()
}

function selectQuestion (questionID) {
  $('.question').removeClass('selected')
  $(`#${questionID}`).addClass('selected')
  scrollIfElementNotVisible('selected')
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
