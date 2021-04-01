const NEWTAB_PAGE = 'newtab/newtab.html';

// ctrl + e = new power user tab
document.addEventListener('keydown', function(e) {

    let active = document.activeElement;
    let input_focused = (active.tagName == 'INPUT' && ['password', 'email', 'text'].indexOf(active.type) > -1) || active.tagName == 'TEXTAREA' || document.activeElement.isContentEditable;

    if (!input_focused && e.key === 't')
    {
      let newtab_url = browser.runtime.getURL(NEWTAB_PAGE);
      browser.runtime.sendMessage({message: newtab_url});    

      e.preventDefault();
    }
  }
);


