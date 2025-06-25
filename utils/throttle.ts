// Leading-throttle function that ensures a function is not called more than once in a specified time interval.
export const leadingThrottle = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let shouldWait = false;
  let waitingArgs: Parameters<T> | null = null;

  const timeoutFunc = () => {
    if (waitingArgs === null) {
      shouldWait = false;
    } else {
      func(...waitingArgs); // Execute the function with the waiting arguments
      waitingArgs = null; //Clean up waitingArgs after execution
      setTimeout(timeoutFunc, delay); // Schedule the next execution
    }
  };

  return (...args: Parameters<T>): void => {
    if (shouldWait) {
      waitingArgs = args;
      console.log('Throttled call, waiting for next execution');
      return;
    }

    console.log('Executing function immediately');

    func(...args);
    shouldWait = true;
    setTimeout(timeoutFunc, delay);
  };
};

// Trailing-throttle function that ensures a function is called at most once in a specified time interval, executing the last call after the delay.
export const trailingThrottle = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>): void => {
    lastArgs = args; // Always update to the latest arguments

    if (timeoutId) {
      console.log('Throttled call, waiting for next execution');
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      if (lastArgs) {
        console.log('Executing throttled function');
        func(...lastArgs);
        lastArgs = null;
      }
      timeoutId = null;
    }, delay);
  };
};
