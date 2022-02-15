/*
*   --------------------------------------    Selenium-Like Methods   --------------------------------------
*
*       Contiene delle Utility generalizzate specifiche per la manipolazione della DOM e la sua interazione
*
*       Ricostruzione delle API di Selenium (con sintassi simile a Selenium IDE)
*
*
*       Proprieta:
*           - waitUntil (fn, ms):
*                   Base di partenza per la costruzione di tutti gli altri waitUntil*. Mette in pausa il codice di una
*                       funzione async fino a che la condizione specificata dalla funzione `fn` non si avvera
*                   Accetta un parametro OPZIONALE `ms` che indica il Timeout in ms oltre il quale restituisce errore
*
*           - sleep (ms):
*                   Mette in pausa il codice di una funzione async per il numero di `ms` passati come parametro
*
*
*       Utilizzo:
*           (async () => {
*               console.log("Operation 1");
*               await SeleniumEngine.sleep(2000);
*               console.log("Operation 2");
*           })()
*
*
*
*   --------------------------------------------------------------------------------------------------------
*/
const SeleniumEngine = {
	/**
	 * 
	 * @param {Function} testCondition Condition that must be met in order to the `waitUntil` function to return
	 * @param {Number} timeout_ms Timeout in milliseconds after which the `waitUntil` function will fail
	 * @param {Number} checkInterval_ms The interval in milliseconds at which the `waitUntil` function will check the condition
	 * @returns 
	 */
	waitUntil: function (testCondition, timeout_ms = 30000, checkInterval_ms = 1000) {
		let start_ts = new Date().getTime();

		return new Promise((resolve, reject) => {
			let timer = window.setInterval(() => {
				let elapsed_time = parseInt(new Date().getTime() - start_ts);

				// Se il timeout è un numero
				if (
					!!timeout_ms &&
					!isNaN(timeout_ms) &&
					timeout_ms > 0 &&
					elapsed_time >= timeout_ms
				) {
					clearInterval(timer);
					reject(
						new Error(`Timeout of ${timeout_ms} ms exceeded (${elapsed_time} real)`)
					);
				}

				if (testCondition()) {
					clearInterval(timer);
					resolve({
						msg:
							`The specified condition was met before the ${timeout_ms} ms timeout`,
						time: elapsed_time,
						given_timeout: timeout_ms,
					});
				}
			}, checkInterval_ms);
		});
	},

	/**
	 *
	 * @param {String} cssSelector The css selector for the element
	 * @param {Number} timeout_ms Timeout in ms
	 *
	 * @example
	 * 		// Will wait until an element with id="test" is present
	 * 		await SeleniumEngine.waitForElementPresent("#test", 2000)
	 */
	waitForElementPresent: function (cssSelector, timeout_ms = 30000) {
		if (!cssSelector.trim()) throw new Error("Please specify a css selector");

		/* 
			Può anche essere definito così:
				return this.waitUntil(() => !!document.querySelector(cssSelector), timeout_ms);
			
			Ritorno il valore di un'altra Promise per poter customizzare meglio le risposte
		*/
		return new Promise((resolve, reject) => {
			this.waitUntil(() => !!document.querySelector(cssSelector), timeout_ms)
			.then((result) =>
				resolve({
					msg: `Element with selector ${cssSelector} is present`,
					time: result.time,
				})
			)
			.catch((result) => reject(new Error(result)));
		});
	},

	/**
	 *
	 * @param {String} cssSelector The css selector for the element
	 * @param {Number} timeout_ms Timeout in ms
	 *
	 * @example
	 * 		// Will wait until an element with id="test" is not present
	 * 		await SeleniumEngine.waitForElementNotPresent("#test", 2000)
	 */
	waitForElementNotPresent: function (cssSelector, timeout_ms = 30000) {
		if (!cssSelector.trim()) throw new Error("Please specify a css selector");

		return new Promise((resolve, reject) => {
			this.waitUntil(() => !document.querySelector(cssSelector), timeout_ms)
			.then((result) =>
				resolve({
					msg: `Element with selector ${cssSelector} is not present`,
					time: result.time,
				})
			)
			.catch((result) => reject(new Error(result)));
		});
	},

	/**
	 * 
	 * @param {Number} ms Time to wait (expressed in milliseconds)
	 * @returns Promise
	 */
	sleep: function (ms = 0) {
		return new Promise((resolve, reject) => {
			if (!ms || isNaN(ms) || ms < 0) {
				reject(new Error("Timeout must be a positive number"));
			}
			setTimeout(resolve, ms);
		});
	}
};


// From https://github.com/umdjs/umd/blob/master/templates/returnExports.js
// if the module has no dependencies, the above pattern can be simplified to
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.SeleniumEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return SeleniumEngine;
}));