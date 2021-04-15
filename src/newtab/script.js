let mode = 'insert'; //or normal
let pos = 0; //caret postion

let input = document.getElementById('input');

function setCaretPos(caretPos) {
  input.setSelectionRange(caretPos, caretPos);
}

function getCaretPos() {
  return input.selectionEnd;
}

document.querySelector('#input').focus();

//focus input on click anywhere (for new tab which don't allowed automatic focus)
document.addEventListener('click', function() {
  document.querySelector('#input').focus();
});

//retrieve aliases
browser.storage.local.get(['aliases']).then(function (res) {
  let settings = res;

  let aliases = [];
  let urls = [];

  if (settings.hasOwnProperty('aliases'))
  {

    for (let i = 0; i < settings.aliases.length; i++)
    {
      aliases.push(settings.aliases[i].alias);
      urls.push(settings.aliases[i].url);
    }
  }

  
  document.addEventListener('keydown', function(e) {
    
      if (document.activeElement.tagName == 'INPUT' && e.key == 'Enter')
      {
        let query = document.querySelector('#input').value;
 
        let cmd = query.split(' ')[0];
        let arg = query.substring(cmd.length + 1);
       
        if (aliases.indexOf(cmd) > -1)
        {
          //alias
          let url = urls[aliases.indexOf(cmd)];
        
          if (url.indexOf('%s') > -1)
            url = url.replace('%s', arg);

          window.location.href = url;
        }
        else if (query == ":settings")
        {
          //go to settings
          document.querySelector('div').classList.add('active');
          document.querySelector('textarea').focus();

          //write aliases in textarea
          let text = '';
          for (let i = 0; i < settings.aliases.length; i++)
            text += settings.aliases[i].alias + ' ' + settings.aliases[i].url + '\n';

          document.querySelector('textarea').value = text;

          
        }
        else if (query == ":resetall")
        {
          //reset storage
          browser.storage.local.set({'aliases': []}).then(
            function () {
              document.querySelector('#input').value = 'press f5';
            }
          );
        }
        else
        {
          //duckduckgo search
          window.location.href = 'https://duckduckgo.com/?q='+query;
        }
      }

      if (mode == 'insert' && e.key == 'Escape') //switch mode
      {
        mode = mode == 'normal' ? 'insert' : 'normal';
        e.preventDefault();
      }
      else if (mode == 'normal') //normal navigation mode
      {

        if (e.key == 'h') //left
        {
          pos = getCaretPos();
          if ( pos > 0 )
           setCaretPos(pos - 1);
          
          e.preventDefault();
        }  
        else if (e.key == 'l') //right
        {
          pos = getCaretPos();
          if (pos < input.value.length)
            setCaretPos(pos + 1);

          e.preventDefault();
        }
        else if (e.key == 'i')
        {
          mode = 'insert';
          e.preventDefault();
        }

      }


  });
});


//set aliases

document.querySelector('#submit').addEventListener('click', function () {
    let aliases = []; 

    let text = document.querySelector('textarea').value;
    let lines = text.split('\n');

    for(let i = 0; i < lines.length; i++)
    {
      let words = lines[i].split(' ');
      let alias = words[0];
      let url = words[1];

      if (alias != '' && alias != undefined && url != '' && url != undefined)
      {
        aliases.push({'alias': alias, 'url': url});
      }
    }

    browser.storage.local.set({'aliases': aliases}).then(
      function (res) {

        document.querySelector('div').classList.remove('active');
        location.reload();
        input.value = "";
        input.focus();
        
      }
    );
    
});

