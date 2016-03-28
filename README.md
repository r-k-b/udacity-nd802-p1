# Instructions

## Meet-Up Event Planner

Prepare for this project with [Building High Conversation Web Forms](https://www.udacity.com/course/building-high-conversion-web-forms--ud890) and [Web Tooling and Automation.](https://www.udacity.com/course/web-tooling-automation--ud892)


## Requirements

You do not need to create a functioning back-end or save user information. Only the form components themselves and their performance will be evaluated.

1. You do not need to create a real back-end or save user information, but the app must provide a form for users to create an account. Account creation should include, but is not limited to:

        Name
        Email address
        Secure password (with character and length requirements)
        Optional public biographical information (such as employer, job title, birthday, etc)

2. The app should allow users to create a new event. Each event should, at a minimum, allow a user to set:

        Name of the event
        Type of the event (birthday party, conference talk, wedding, etc.)
        Event host (could be an individual’s name or an organization)
        Event start date and time
        Event end date and time
        Guest list
        Location
        Optional message to the guests with additional information about the event

3. The app should display events that have been created.


## Tips, Tricks, and Advice

You may find that you want to save user information in some way, as opposed to just hard-coding in a few events to meet the “display events” requirement. You could accomplish this by using localStorage or by using a “back-end as a service” platform like Firebase.

You can use any framework you’d like - or don’t! It’s up to you.

Need some help testing your site with a screen reader? Check out [this video](https://www.udacity.com/course/viewer#!/c-ud882/l-3574748851/m-3775718655) from our Responsive Images course for some tips.

Use [this checklist](http://labs.udacity.com/images/web-forms-checklist.pdf) as a reference to help you throughout this project.

## Evaluation

Your project will be evaluated by a Udacity reviewer according to the rubric below. Be sure to review it thoroughly before you submit. All criteria must "meet specifications" in order to pass.

### Completion
 
**Does Not Meet Specifications:**

App does not include all requirements - account creation, event creation and display.

**Does Meet Specifications:** 

App includes all requirements - account creation, event creation and event display.

### User Experience

**Does Not Meet Specifications:**

On mobile, the form is not fully functional or does not react to touches naturally.

The form is not understandable while using a screen reader.

Form prompts appear in a confusing order.
 
**Does Meet Specifications:**
 
On mobile, the form is fully functional and reacts to touches naturally.

The form is understandable while using a screen reader.

Form prompts appear in a logical order.


### Responsiveness

**Does Not Meet Specifications:**

Content is not responsive 


### Form Design

**Does Not Meet Specifications:**

Most form prompts (including labels, placeholders, etc) are designed for developers - they resemble unfriendly database key-value pairs.

Some inputs can be combined.

Users can submit a form with invalid information.

Validation occurs after a user presses submit or is not obvious.
 
**Does Meet Specifications:** 

Most form prompts (including labels, placeholders, etc) are designed for users and their goals - they are phrased in friendly, human language.

There are as few inputs as possible.

Users cannot submit a form with invalid information.

Validation occurs no later than immediately after user focus leave the input and is obvious.


# todo

- [ ] account creation
- [ ] event creation
- [ ] event list
- [ ] a11y review
