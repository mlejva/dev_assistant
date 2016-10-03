'use strict'
const CONSTS = require('../js/constants.js') // Current pathname is in html folder
const Config = require('electron-config')
const config = new Config()

class QuestionElement extends HTMLElement {

  constructor () {
    console.log('Constructor 21')
    super()
    console.log('Constructor 2')
  }

  /*
  constructor (questionJSON) {
    super()
    console.log('Constructor')

    for (let property in questionJSON) {
      switch (property) {
        case CONSTS.SO_QUESTION_IS_ANSWERED_JSON_KEY:
          this.isAnswered = questionJSON.property
          // question[CONSTS.SO_QUESTION_IS_ANSWERED_JSON_KEY] = value
          break
        case CONSTS.SO_QUESTION_TITLE_JSON_KEY:
          this.title = questionJSON.property
          // question[CONSTS.SO_QUESTION_TITLE_JSON_KEY] = value
          break
        case CONSTS.SO_QUESTION_BODY_JSON_KEY:
          this.body = questionJSON.property
          // question[CONSTS.SO_QUESTION_BODY_JSON_KEY] = value
          break
        case CONSTS.SO_QUESTION_ID_JSON_KEY:
          this.id = questionJSON.property
          // question[CONSTS.SO_QUESTION_ID_JSON_KEY] = value
          break
        case CONSTS.SO_QUESTION_LINK_JSON_KEY:
          this.link = questionJSON.proprty
          // question[CONSTS.SO_QUESTION_LINK_JSON_KEY] = value
          break
      }
    }

  }
  */
  getAnswers (callback) {

  }

/* Lifecycle callbacks */
  createdCallback () {
    this.addEventListener('click', (e) => {
      if (!this.hasClass('selected')) {
        $('.question').removeClass('selected')
        this.addClass('selected')
        $('.asnwers').empty()
        $('.answers').append(CONSTS.SPINNER_HTML)
        this.getAnswers((answers) => {
          config.set(CONSTS.CONFIG_SELECTED_QUESTION, this.id)
          config.set(CONSTS.CONFIG_SELECTED_QUESTION_ANSWERS, answers)
          // TODO: Show answers
        })
      }
    })
  }

}
