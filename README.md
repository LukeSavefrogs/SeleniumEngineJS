# SeleniumEngineJS
Selenium-like methods useful for automating SPAs (Single Page Application) where content is changed dynamically

## Methods
#### SeleniumEngine.waitUntil(testCondition, timeout_ms)
Pauses the execution of the current function until the provided function `testCondition` is truthy (the function is executed every 1000 ms). Throws an error if wait time exceeds `timeout_ms` (default is _30000_).
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

#### SeleniumEngine.sleep(ms)
Pauses the execution of the current function for the number of milliseconds passed as parameter
```javascript
(async () => {
    console.log("Operation 1");
    
    // Pause function for 2 seconds
    await SeleniumEngine.sleep(2000);

    console.log("Operation 2");
})()
```
