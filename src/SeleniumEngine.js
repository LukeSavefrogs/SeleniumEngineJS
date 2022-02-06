(() => {
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
	* 	Dalla versione 2.4 viene esportata nello scope globale in modo che possa essere usata anche nella Developer Console
	*   --------------------------------------------------------------------------------------------------------
	*/
	window.SeleniumEngine = {
		waitUntil: function (testCondition, timeout_ms = 30000) {
			let start_ts = performance.now();

			return new Promise((resolve, reject) => {
				let timer = window.setInterval(() => {
					let elapsed_time = parseInt(performance.now() - start_ts);

					// Se il timeout è un numero
					if (
						!!timeout_ms &&
						!isNaN(timeout_ms) &&
						timeout_ms > 0 &&
						elapsed_time >= timeout_ms
					) {
						clearInterval(timer);
						reject(
							`Timeout of ${timeout_ms} ms exceeded (${elapsed_time} real)`
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
				}, 1000);
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
			if (!cssSelector) throw new Error("Please specify a css selector");

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
				.catch((result) => reject(result));
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
			if (!cssSelector) throw new Error("Please specify a css selector");

			return new Promise((resolve, reject) => {
				this.waitUntil(() => !document.querySelector(cssSelector), timeout_ms)
				.then((result) =>
					resolve({
						msg: `Element with selector ${cssSelector} is not present`,
						time: result.time,
					})
				)
				.catch((result) => reject(result));
			});
		},
		sleep: (ms  = 0) => new Promise((res) => setTimeout(res, ms)),
	};
})(window);
