[![GitHub release](https://img.shields.io/github/release/LukeSavefrogs/SeleniumEngineJS.svg)](https://GitHub.com/LukeSavefrogs/SeleniumEngineJS/releases/)

# SeleniumEngineJS
Selenium-like methods useful for automating SPAs (Single Page Application) where content is changed dynamically.

## Introduction 
This little script written in vanilla JS tries to **emulate** some of the **Selenium** most useful features, such as the _Expected Conditions_. It was originally written to be included into _Tampermonkey/Greasemonkey scripts_ to bring the power of selenium into user scripts and be able to automate even **Single Page Applications** (where usually content and elements are loaded dynamically and URLs don't change, making automation really hard).

The script itself uses [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) but the real deal is the use of [**async/await**](https://javascript.info/async-await) in your code to chain Promises in a cleaner way so that async code **looks** as if it was syncronous (but IT IS NOT, don't get confused). 

As of October 2020, async/await keywords are [supported everywhere EXCEPT Internet Explorer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#Browser_compatibility), which does not even support Promises thus making this script completely useless (but i think almost nobody is still using it :smile:). 

Even **without** async/await you could still chain the operations by using `Promise.then()`, but it is just another way of going down the good old [callback hell](http://callbackhell.com/) :worried:.

## How to use
- Simply **copy and paste** the code into yours and use :smile:
- Use a **CDN**:
  - [JSDelivr](https://www.jsdelivr.com/package/npm/selenium-engine-js)
	```html
	<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/selenium-engine-js/src/SeleniumEngine.cjs"></script>
	```

  - [UnPkg](https://unpkg.com/selenium-engine-js/src/SeleniumEngine.cjs)
	```html
	<script type="text/javascript" src="https://unpkg.com/selenium-engine-js/src/SeleniumEngine.cjs"></script>
	```

- **Include** directly the file (so that updates will be reflected on your code):
    - _Javascript_ (eval): 
	```javascript
	fetch("https://raw.githubusercontent.com/LukeSavefrogs/SeleniumEngineJS/main/src/SeleniumEngine.cjs").then(data => data.text()).then(body => eval(body))
	```
    -  NodeJS (CJS)
	```javascript
	const SeleniumEngine = require("SeleniumEngine");
	```

    -  NodeJS (ESModules):
	```javascript
	import SeleniumEngine from "SeleniumEngineJS";
	```


> ### Important
> All the methods MUST be used inside an **async function**, as for the examples below

## Methods
#### SeleniumEngine.waitUntil(testCondition, timeout_ms)
Used internally by [`SeleniumEngine.waitForElementPresent()`](#seleniumenginewaitforelementpresentcssselector-timeout_ms) and [`SeleniumEngine.waitForElementNotPresent()`](#seleniumenginewaitforelementnotpresentcssselector-timeout_ms). **Pauses** the execution of the current function until the provided function `testCondition` is **truthy** (the function is executed every 1000 ms). 

**Throws** an error if wait time exceeds `timeout_ms` (default is _30000_).

```javascript
(async () => {
    console.log("Operation 1");
    
    let test_switch = false;
    window.setTimeout(() => { test_switch = true}, 4500);


    // Returns after the variable `test_switch` has become true
    await SeleniumEngine.waitUntil(() => test_switch == true)
        .then((resp) => console.log("Now we can continue with the example. We have waited for %d ms", resp.time));
    
    
    console.log("As you can see we can have other code as well here")


    // Throws `Timeout of 30000ms exceeded (30016 real)`
    await SeleniumEngine.waitUntil(() => false)
        .then(() => console.log("This won't be executed"))
        .catch(e => console.log("As expected, has returned an exception: %o", e));
    
    
    // Will wait forever, because timeout is disabled and the expected condition is NEVER met
    await SeleniumEngine.waitUntil(() => false, 0);


    console.log("Operation 2");
})()
```

#### SeleniumEngine.waitForElementPresent(cssSelector, timeout_ms)
**Pauses** the execution of the current function until an **element** matching the provided CSS selector is **found**. 

**Throws** an exception if it isn't found before `timeout_ms` ms

```javascript
window.setTimeout(() => {
    let test_element = document.createElement("span");
    test_element.id = "test";
    
    document.body.appendChild(test_element);
}, 5000);

(async () => {
    console.log("Operation 1");
    
    // Pause function for 5 seconds, then continues
    await SeleniumEngine.waitForElementPresent("#test", 8000)

    console.log("Operation 2");
})()
```

#### SeleniumEngine.waitForElementNotPresent(cssSelector, timeout_ms)
**Pauses** the execution of the current function until an **element** matching the provided CSS selector is **no longer found**

**Throws** an exception if it isn't found before `timeout_ms` ms

```javascript
// Example initialization
(() => {
    // First we create the test element
    let test_element = document.createElement("span");
    test_element.id = "test";

    document.body.appendChild(test_element);

    // Then after 5 seconds we remove it
    window.setTimeout(() => {
        document.getElementById("test").remove()
    }, 5000);
})()


// Actual example
(async () => {
    console.log("Operation 1");
    
    // Pause function for 5 seconds, then continues
    await SeleniumEngine.waitForElementNotPresent("#test", 8000)

    console.log("Operation 2");
})()
```

#### SeleniumEngine.sleep(ms)
**Pauses** the execution of the current function for the number of **milliseconds** passed as parameter.

```javascript
(async () => {
    console.log("Operation 1");
    
    // Pause function for 2 seconds
    await SeleniumEngine.sleep(2000);

    console.log("Operation 2");
})()
```
