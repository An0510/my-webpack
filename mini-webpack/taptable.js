import {
  SyncHook,
  AsyncParallelHook
} from 'tapable'

class List {
  getRoutes() {
    console.log('run getRoutes')
  }
}

class Car {
  constructor() {
    this.hooks = {
      // newSpeed代表accelerate传入的参数
      accelerate: new SyncHook(["newSpeed"]),
      brake: new SyncHook(),
      calculateRoutes: new AsyncParallelHook([
        "source",
        "target",
        "routesList"
      ])
    };
  }

  // 通过call来触发
  setSpeed(newSpeed) {
    // following call returns undefined even when you returned values
    // call就是触发事件
    this.hooks.accelerate.call(newSpeed);
  }

  useNavigationSystemPromise(source, target) {
    const routesList = new List();
    return this.hooks.calculateRoutes
        .promise(source, target, routesList)
        .then((res) => {
          console.log('useNavigationSystemPromise then')
          // res is undefined for AsyncParallelHook
          return routesList.getRoutes();
        });
  }

  useNavigationSystemAsync(source, target, callback) {
    const routesList = new List();
    this.hooks.calculateRoutes.callAsync(source, target, routesList, err => {
      if (err) return callback(err);
      callback(null, routesList.getRoutes());
    });
  }
}

// 1.注册事件
const car = new Car()
// 将不同函数的this绑定到构造函数this.hooks.accelerate的this并执行
car.hooks.accelerate.tap("test 1", (speed) => {
  console.log("accelerate", speed)
})
// 2.触发事件 事件内部绑定的是hooks.accelerate
car.setSpeed(10)

// promise注册
car.hooks.calculateRoutes.tapPromise("test 2 promise", (source, target) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('-----------tapPromise 1', source)
      resolve()
    }, 500)
  })
})

car.hooks.calculateRoutes.tapPromise("test 3 promise", (source, target) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('-----------tapPromise 2', source)
      resolve()
    }, 500)
  })
})

// car.useNavigationSystemPromise(["1", "2", "3"], 1)

car.hooks.calculateRoutes.tapAsync("calculateRoutes tapAsync", (source, target, routesList, callback) => {
  // return a promise
  setTimeout(() => {
    console.log(`tapAsync ${source}`)
    callback();
  }, 1000)
});

car.useNavigationSystemPromise(["1", "2", "3"], 1)

car.useNavigationSystemAsync('useNavigationSystemAsync','and', () => {
  console.log('callback')
})