const { Timestamp } = require("mongodb");

function actionLog(command, user, prevAmount, changedAmount, commandUser) {
    try {
        console.log(`[${Timestamp()}] ${command} <${user}> ${prevAmount} -> ${changedAmount} By ${commandUser}`);
    } catch (error) {
    }
}

module.exports = { actionLog };
