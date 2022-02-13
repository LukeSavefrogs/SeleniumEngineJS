const test = require('ava');

const SeleniumEngine = require("../src/SeleniumEngine.cjs");

test("Waits for 2 seconds between the two operations", async t => {
	// console.log(`[${(new Date()).toISOString()}] Operation 1`);
	await SeleniumEngine.sleep(2000);
	// console.log(`[${(new Date()).toISOString()}] Operation 2`);
	t.pass();
})