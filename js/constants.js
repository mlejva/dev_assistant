'use strict'

const LOADING_INDICATOR_HTML = `<div id="loading-indicator" class="sk-fading-circle">
                                <div class="sk-circle1 sk-circle"></div>
                                <div class="sk-circle2 sk-circle"></div>
                                <div class="sk-circle3 sk-circle"></div>
                                <div class="sk-circle4 sk-circle"></div>
                                <div class="sk-circle5 sk-circle"></div>
                                <div class="sk-circle6 sk-circle"></div>
                                <div class="sk-circle7 sk-circle"></div>
                                <div class="sk-circle8 sk-circle"></div>
                                <div class="sk-circle9 sk-circle"></div>
                                <div class="sk-circle10 sk-circle"></div>
                                <div class="sk-circle11 sk-circle"></div>
                                <div class="sk-circle12 sk-circle"></div>
                              </div>`

const SO_KEY = 'wkazQ2XH3buNy7D)0hnXWw(('
// TODO: More specific constants for API and final API will be createdy of these pieces
const SO_SEARCH_QUESTIONS_API = `https://api.stackexchange.com/2.2/search/advanced?key=${SO_KEY}&order=desc&sort=relevance&site=stackoverflow&filter=!-*f(6rc.lFba`
const SO_ANSWERS_TO_QUESTION_BASE_API = 'https://api.stackexchange.com/2.2/questions/'
const SO_ANSWERS_TO_QUESTION_PARAMETERS_API = `/answers?key=${SO_KEY}&order=desc&sort=votes&site=stackoverflow&filter=!9YdnSMKKT`

const SO_QUESTION_IS_ANSWERED_JSON_KEY = 'is_answered'
const SO_QUESTION_TITLE_JSON_KEY = 'title'
const SO_QUESTION_BODY_JSON_KEY = 'body'
const SO_QUESTION_ID_JSON_KEY = 'question_id'
const SO_QUESTION_LINK_JSON_KEY = 'link'

const SO_ANSWER_IS_ACCEPTED_JSON_KEY = 'is_accepted'
const SO_ANSWER_SCORE_JSON_KEY = 'score'
const SO_ANSWER_BODY_JSON_KEY = 'body'
const SO_ANSWER_LINK_JSON_KEY = 'link'

const SEARCH_WINDOW_WIDTH = 800
const SEARCH_WINDOW_HEIGHT = 400
const SEARCH_WINDOW_MAX_HEIGHT = 400

const ENTER_KEYCODE = 13
const ARROW_UP_KEYCODE = 38
const ARROW_DOWN_KEYCODE = 40

const CONFIG_SELECTED_QUESTION_ID = 'selected-question-id'
const CONFIG_ANSWERS_SCROLL_TOP = 'answers-scrollTop'
const CONFIG_SELECTED_QUESTION_ANSWERS = 'selected-question-answers'
const CONFIG_SLIDER_POSITION_X = 'slider-position-x'
const CONFIG_SEARCH_WINDOW_LAST_BOUNDS = 'search-window-last-bounds'
const CONFIG_QUESTIONS = 'questions'
const CONFIG_ANSWERS = 'answers'
const CONFIG_USER_INPUT = 'user-input'
const CONFIG_VIEW_TYPE = 'view-type'
const CONFIG_VIEW = {
  SEARCH: 'search',
  STARRED: 'starred',
  SETTINGS: 'settings',
  INFO: 'info'
}

module.exports = {
  LOADING_INDICATOR_HTML: LOADING_INDICATOR_HTML,
  SO_KEY: SO_KEY,
  SO_SEARCH_QUESTIONS_API: SO_SEARCH_QUESTIONS_API,
  SO_ANSWERS_TO_QUESTION_BASE_API: SO_ANSWERS_TO_QUESTION_BASE_API,
  SO_ANSWERS_TO_QUESTION_PARAMETERS_API: SO_ANSWERS_TO_QUESTION_PARAMETERS_API,
  SO_QUESTION_IS_ANSWERED_JSON_KEY: SO_QUESTION_IS_ANSWERED_JSON_KEY,
  SO_QUESTION_TITLE_JSON_KEY: SO_QUESTION_TITLE_JSON_KEY,
  SO_QUESTION_BODY_JSON_KEY: SO_QUESTION_BODY_JSON_KEY,
  SO_QUESTION_ID_JSON_KEY: SO_QUESTION_ID_JSON_KEY,
  SO_QUESTION_LINK_JSON_KEY: SO_QUESTION_LINK_JSON_KEY,
  SO_ANSWER_IS_ACCEPTED_JSON_KEY: SO_ANSWER_IS_ACCEPTED_JSON_KEY,
  SO_ANSWER_SCORE_JSON_KEY: SO_ANSWER_SCORE_JSON_KEY,
  SO_ANSWER_BODY_JSON_KEY: SO_ANSWER_BODY_JSON_KEY,
  SO_ANSWER_LINK_JSON_KEY: SO_ANSWER_LINK_JSON_KEY,
  SEARCH_WINDOW_WIDTH: SEARCH_WINDOW_WIDTH,
  SEARCH_WINDOW_HEIGHT: SEARCH_WINDOW_HEIGHT,
  SEARCH_WINDOW_MAX_HEIGHT: SEARCH_WINDOW_MAX_HEIGHT,
  ENTER_KEYCODE: ENTER_KEYCODE,
  ARROW_UP_KEYCODE: ARROW_UP_KEYCODE,
  ARROW_DOWN_KEYCODE: ARROW_DOWN_KEYCODE,
  CONFIG_SELECTED_QUESTION_ID: CONFIG_SELECTED_QUESTION_ID,
  CONFIG_ANSWERS_SCROLL_TOP: CONFIG_ANSWERS_SCROLL_TOP,
  CONFIG_SELECTED_QUESTION_ANSWERS: CONFIG_SELECTED_QUESTION_ANSWERS,
  CONFIG_SLIDER_POSITION_X: CONFIG_SLIDER_POSITION_X,
  CONFIG_SEARCH_WINDOW_LAST_BOUNDS: CONFIG_SEARCH_WINDOW_LAST_BOUNDS,
  CONFIG_QUESTIONS: CONFIG_QUESTIONS,
  CONFIG_ANSWERS: CONFIG_ANSWERS,
  CONFIG_USER_INPUT: CONFIG_USER_INPUT,
  CONFIG_VIEW_TYPE: CONFIG_VIEW_TYPE,
  CONFIG_VIEW: CONFIG_VIEW
}
