function handleMessage(data)
{
  console.log(data.message);
  browser.tabs.create({url: data.message});
};

browser.runtime.onMessage.addListener(handleMessage);
