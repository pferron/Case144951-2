import { ObserverFactory, Events } from '@tools/ObserverFactory';

describe('SubscriberFactory', () => {
  it('Verify factory method returns the correct instance', () => {
    expect(ObserverFactory.getObserver(Events.GRAPHQL_UNAUTHORIZED)).toBe(
      ObserverFactory.getObserver(Events.GRAPHQL_UNAUTHORIZED)
    );

    expect(ObserverFactory.getObserver('test1')).not.toBe(
      ObserverFactory.getObserver('test2')
    );
  });

  it('Subscribers get notified with correct data', () => {
    const unauthorizedSubject = ObserverFactory.getObserver(
      Events.GRAPHQL_UNAUTHORIZED
    );
    const nextSubscriber1 = jest.fn();
    const nextSubscriber2 = jest.fn();
    unauthorizedSubject.subscribe(nextSubscriber1);
    const subscription2 = unauthorizedSubject.subscribe(nextSubscriber2);
    const data = 'Test 123';

    ObserverFactory.getObserver(Events.GRAPHQL_UNAUTHORIZED).notify(data);
    expect(nextSubscriber1).toHaveBeenCalledWith(data);
    expect(nextSubscriber1).toHaveBeenCalledTimes(1);
    expect(nextSubscriber2).toHaveBeenCalledWith(data);
    expect(nextSubscriber2).toHaveBeenCalledTimes(1);

    // verify only the subscribed get notified
    subscription2.unsubscribe();
    unauthorizedSubject.notify(data);
    expect(nextSubscriber1).toHaveBeenCalledTimes(2);
    expect(nextSubscriber2).toHaveBeenCalledTimes(1);
  });

  it('Unsubscribing all subscribers should not trigger any of the callbacks', () => {
    const unauthorizedSubject = ObserverFactory.getObserver(
      Events.GRAPHQL_UNAUTHORIZED
    );
    const nextSubscriber1 = jest.fn();
    const nextSubscriber2 = jest.fn();

    unauthorizedSubject.subscribe(nextSubscriber1);

    unauthorizedSubject.subscribe(nextSubscriber2);

    unauthorizedSubject.clearSubscribers();
    const data = 'Test 123';
    ObserverFactory.getObserver(Events.GRAPHQL_UNAUTHORIZED).notify(data);
    expect(nextSubscriber1).not.toHaveBeenCalled();
    expect(nextSubscriber2).not.toHaveBeenCalled();
  });
});
