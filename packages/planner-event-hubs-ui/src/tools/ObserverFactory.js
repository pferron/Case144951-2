const Events = Object.freeze({
  GRAPHQL_UNAUTHORIZED: 'GRAPHQL_UNAUTHORIZED'
});

class Observer {
  subscribers = [];

  subscribe(callback) {
    const that = this;
    const index = this.subscribers.push(callback) - 1;
    return {
      unsubscribe() {
        that.subscribers.splice(index, 1);
      }
    };
  }

  clearSubscribers() {
    this.subscribers = [];
  }

  notify(data) {
    this.subscribers.forEach(callback => {
      callback(data);
    });
  }
}

class ObserverFactory {
  static observers = {};

  static getObserver(subject) {
    if (!ObserverFactory.observers[subject]) {
      ObserverFactory.observers[subject] = new Observer();
    }

    return ObserverFactory.observers[subject];
  }
}

export { ObserverFactory, Observer, Events };
