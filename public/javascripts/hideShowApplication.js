'use strict'

$(document).ready(function() {
  var formState = {
    owns_home: null,
    mortgage_up_to_date: null,
    restOfFormVisible: false,
  }
  
  var advocateState = {
	  advo_bool: null,
	  advocateFormVisible: false,
  }

  $('[name=owns_home]').on('click', checkBothSelected)
  $('[name=mortgage_up_to_date]').on('click', checkBothSelected)
  $('[name=advo_bool]').on('click', checkAdvocateSection)

  function checkBothSelected(e) {
    // Handle the event and update the state
    formState[e.target.name] = e.target.value

    if (formState.owns_home !== null &&
        formState.mortgage_up_to_date !== null &&
        formState.restOfFormVisible === false
    ) {
      // Make the form visible
      formState.restOfFormVisible = true
      toggleFormSectionVisibility()


    } 
	
	/*else if ((formState.owns_home === "false" ||
               formState.mortgage_up_to_date === "false") &&
               formState.restOfFormVisible === true
    ) {
      // Make form not visible
      formState.restOfFormVisible = false
      toggleFormSectionVisibility()

    }*/
  }
  
function checkAdvocateSection(e) {
    // Handle the event and update the state
    advocateState[e.target.name] = e.target.value

    if (advocateState.advo_bool === "true" &&
        advocateState.advocateFormVisible === false
    ) {
      // Make the advocate section visible
      advocateState.advocateFormVisible = true
      toggleAdvocateDisplay()
    } 
	else if (advocateState.advo_bool === "false" &&
        advocateState.advocateFormVisible === true
    ) {
      // Hide the advocate section
      advocateState.advocateFormVisible = false
      toggleAdvocateDisplay()
    } 
	
  }
  function toggleAdvocateDisplay() {
    $('.advoSection').each(function(i) {
      // Skip the first, since that's the initial question being asked
      // Those should always stay visible
      //if (i > 0) {
        var currentState = $(this).css('display')
        $(this).css('display', (advocateState.advocateFormVisible ? 'inherit' : 'none'))
      //}
    })
  }
  
  function toggleFormSectionVisibility() {
    $('.formSection').each(function(i) {
      // Skip the first, since that's the initial question being asked
      // Those should always stay visible
      if (i > 0) {
        var currentState = $(this).css('display')
        $(this).css('display', (formState.restOfFormVisible ? 'inherit' : 'none'))
      }
    })
  }
})
