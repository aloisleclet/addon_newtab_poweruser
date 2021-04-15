function handleMessage(data)
{
  console.log(data.message);
  browser.tabs.create({url: data.message});
};

browser.runtime.onMessage.addListener(handleMessage);


function newOrderListener(message, sender) {
    if (message === 'new-order-event') {
        console.log('Received event for window %s, tab %s', sender.tab.windowId, sender.tab.id);
        browser.windows.update(sender.tab.windowId, {
            drawAttention: true,
            focused: true,
            state: 'maximized'}
        ).then(() => browser.tabs.update(sender.tab.id, {
            active: true
        }));
    }
}
browser.runtime.onMessage.addListener(newOrderListener);
