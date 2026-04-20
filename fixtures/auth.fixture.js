const base = require('@playwright/test');
const { AuthFlows } = require('../flows/AuthFlows');

/**
 * Fixture custom con login automático
 */
exports.test = base.test.extend({
    authenticatedPage: async ({ page }, use) => {
        const authFlow = new AuthFlows(page);

        const mainPage = await authFlow.loginSuccess(
            process.env.USER,
            process.env.PASSWORD
        );

        await use(mainPage);
    }
});

exports.expect = base.expect;