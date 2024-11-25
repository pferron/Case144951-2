# 1. Record architecture decisions

Date: 2022-12-29

## Status

Accepted

## Context

Add Production verification tests(PVT).

## Decision

### E2E

* Add files you want to run PVT in PVT suite [here.](../../packages/planner-event-hubs-e2e/configs/wdio.conf.ts)
* We run all E2E in PVT suite on prod during deployment.
* You may want to skip failure scenarios or some other cases on prod then wrap your test in <b>skipItIfProdEnvironment</b>.
* You can use <b>skipDescribeIfProdEnvironment</b> to skip whole describe block.
```
  skipItIfProdEnvironment()( 'should open channel list page for an active hub with no active channels', async () => {
      await ChannelListPage.openPage(hubWithoutChannel);
      await ChannelListPage.waitForElementLoad(await ChannelListPage.channelHeader(), 10000);
      await expectElementPresentOrNot(await ChannelListPage.emptyChannelPage());
    }
  );
```

### IT
* We run all IT on prod by default during deployment. 
* You may want to skip failure scenarios or some other cases on prod then wrap your test in <b>skipItIfProdEnvironment</b>.
* You can use <b>skipDescribeIfProdEnvironment</b> to skip whole describe block.
```
  skipItIfProdEnvironment()('image upload should fail due to url not present', async () => {
    await expect(
      async () =>
        await clientWithIncorrectRole.query({
          query: channel,
          variables: {
            channelId: channelWithImage.id
          }
        })
    ).rejects.toThrow('Unauthorized');
  });
```

## Consequences

* We need to manually skip cases from PVT.