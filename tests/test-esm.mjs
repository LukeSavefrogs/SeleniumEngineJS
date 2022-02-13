import test from 'ava';

import SeleniumEngine from "../src/esm/wrapper.mjs";

test("Waits for 2 seconds between the two operations", async t => {
	// console.log(`[${(new Date()).toISOString()}] Operation 1`);
	await SeleniumEngine.sleep(2000);
	// console.log(`[${(new Date()).toISOString()}] Operation 2`);
	t.pass();
})

test("Should return error", async t => {
	// console.log(`[${(new Date()).toISOString()}] Operation 1`);
	const error = await t.throwsAsync(SeleniumEngine.sleep(-1));

	// console.log(`[${(new Date()).toISOString()}] Operation 2`);
	t.is(error.message, "Timeout must be a positive number");
})