# Alexa Skills Kit Operational Test (askot)
[![Travis build status](http://img.shields.io/travis/rajington/askot.svg?style=flat)](https://travis-ci.org/rajington/askot)
[![Code Climate](https://codeclimate.com/github/rajington/askot/badges/gpa.svg)](https://codeclimate.com/github/rajington/askot)
[![Test Coverage](https://codeclimate.com/github/rajington/askot/badges/coverage.svg)](https://codeclimate.com/github/rajington/askot)
[![Dependency Status](https://david-dm.org/rajington/askot.svg)](https://david-dm.org/rajington/askot)
[![devDependency Status](https://david-dm.org/rajington/askot/dev-status.svg)](https://david-dm.org/rajington/askot#info=devDependencies)

Quickly test Alexa Skills without using speech. Test plans are defined conversationally with request generation and response validation using your handler directly (currently only node.js), or a skill's Lambda ARN, or a REST API endpoint.

Optionally supports translating natural language requests directly to the corresponding intent using your skill's Intent Schema and Utterances.

askot was built using:
- [alexa-skills-kit-client](https://github.com/rajington/alexa-skills-kit-client) to make requests
- [chai-alexa](https://github.com/rajington/chai-alexa) to validate response
- [alexa-schemas](https://github.com/rajington/alexa-skills-kit-test) to validate response schemas
- [commander.js](https://github.com/tj/commander.js/) for the CLI
- [mocha.js](mochajs.org) for testing
- [chai.js](http://chaijs.com/) for assertions
- [js-yaml](https://github.com/nodeca/js-yaml) for YAML support
- [node-csv-parse](https://github.com/wdavidw/node-csv-parse) for CSV/TSV support

## Examples

All examples use [`example-color-expert`](http://amzn.to/1LzFrj6).

### Simple CSV scripts with speech requests and expected responses

Launch requests are specified by blank text.

Intent requests are specified in a format similar to, but not identical to, a skill's "Sample Utterances".

Currently, the intent, the slot value, and the slot name must be specified.
Slot values are NOT parsed, even for the [built-in slots](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interaction-model-reference#slot-types) (e.g. "today" will NOT be parsed into "2015-11-24").

Sessions can be separated by line breaks

```csv
,Welcome to the Alexa Skills Kit sample
MyColorIsIntent my favorite color is {blue|Color},I now know your favorite color
WhatsMyColorIntent what's my favorite color,Your favorite color is blue

WhatsMyColorIntent what's my favorite color,I don't know what yours is
```

### Powerful YAML/JSON scripts with manual requests and complex validation

```yaml
title: Specifying and requesting colors
events:
  - title: Launching
    generate: # null assumes LaunchRequest
    validate: I'm not sure what your favorite color is # simple response validation
  - title: Setting color
    generate: # complex request generation
      intent: MyColorIsIntent
      slots:
        Color: blue
    validate: # complex response validation
      response:
        sessionAttributes:
          favoriteColor: blue # verify a session attribute was saved
  - title: Getting color
    generate: what's my favorite color # simple request generation
    validate:
      card:
        content: blue
      response:
        shouldEndSession: true

---

title: Requesting color without specifying
events:
  - title: Getting color
    generate: what's my favorite color
    validate: I'm not sure
```

Can also be specified using JSON, with separate sessions as elements in an array

```json
[
  {
    "title": "Specifying and requesting colors",
    "events": [
      {
        "title": "Launching",
        "generate": null,
        "validate": "I'm not sure what your favorite color is"
      },
      {
        "title": "Setting color",
        "generate": {
          "intent": "MyColorIsIntent",
          "slots": {
            "Color": "blue"
          }
        },
        "validate": {
          "response": {
            "sessionAttributes": {
              "favoriteColor": "blue"
            }
          }
        }
      },
      {
        "title": "Getting color",
        "generate": "what's my favorite color",
        "validate": {
          "card": {
            "content": "blue"
          },
          "response": {
            "shouldEndSession": true
          }
        }
      }
    ]
  },
  {
    "title": "Requesting color without specifying",
    "events": [
      {
        "title": "Getting color",
        "generate": "what's my favorite color",
        "validate": "I'm not sure"
      }
    ]
  }
]
```
