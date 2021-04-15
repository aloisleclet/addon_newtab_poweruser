const NEWTAB_PAGE = 'newtab/newtab.html';

// ctrl + e = new power user tab
document.addEventListener('keydown', function(e) {

    console.log(e.key);

    if ((e.altKey || e.ctrlKey) && e.key === 't')
    {
      let newtab_url = browser.runtime.getURL(NEWTAB_PAGE);
      browser.runtime.sendMessage({message: newtab_url});    

      e.preventDefault();
    }
  }
);


