var express = require("express");
var router = express.Router();
const browserAutomateService = require("../service/browser-automation-service");
const { withFailSafe, sendResponse } = require("../utils/common");
const messages = require("../utils/messages");
const { isEmpty } = require("lodash");
const { entity } = require("../constants");

router.post("/start", (req, res) =>
  withFailSafe(
    null,
    messages.FAILED_TO_OPEN(entity.BROWSER)
  )(async (req, res) => {
    const { value, errors } = await browserAutomateService.openBrowser(
      req.body
    );
    if (isEmpty(errors)) {
      return sendResponse(res, 201, messages.SUCCESS, {}, [], value);
    }
    return sendResponse(res, 500, messages.UNKNOWN_ERROR, {}, errors, {});
  })(req, res)
);

router.post('/stop', (req, res) =>
  withFailSafe(
    null,
    messages.FAILED_TO_OPEN(entity.BROWSER)
  )(async (req, res) => {
    const { value, errors } = await browserAutomateService.closeBrowser(
      req.body
    );
    if (isEmpty(errors)) {
      return sendResponse(res, 201, messages.SUCCESS, {}, [], value);
    }
    return sendResponse(res, 500, messages.UNKNOWN_ERROR, {}, errors, {});
  })(req, res));

router.post('/cleanup', (req, res) =>
  withFailSafe(
    null,
    messages.FAILED_TO_OPEN(entity.BROWSER)
  )(async (req, res) => {
    const { value, errors } = await browserAutomateService.cleanupBrowser(
      req.body
    );
    if (isEmpty(errors)) {
      return sendResponse(res, 201, messages.SUCCESS, {}, [], value);
    }
    return sendResponse(res, 500, messages.UNKNOWN_ERROR, {}, errors, {});
  })(req, res))
module.exports = router;
