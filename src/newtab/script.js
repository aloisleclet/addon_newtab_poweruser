let mode = 'insert'; //vim mode
let pos = 0; //caret postion

let input = document.getElementById('input');

//vim functions

function setCaretPos(caretPos) {
  input.setSelectionRange(caretPos, caretPos);
}

function getCaretPos() {
  return input.selectionEnd;
}

//get matchs

function getMatchAliases(aliases, alias)
{
  let res = [];

  for (let i = 0; i < aliases.length; i++)
  {
    if (aliases[i].alias == alias)
      res.push(aliases[i])
  }

  console.log(aliases)
  return res; 
}

//set colors
function setColors(colors)
{
  document.body.style.backgroundColor = colors.primary;
  document.querySelector('#input').style.backgroundColor = colors.secondary;
  document.querySelector('textarea').style.backgroundColor = colors.primary;
  document.body.style.color = colors.font;
}

document.querySelector('#input').focus();

//focus input on click anywhere (for new tab which don't allowed automatic focus)
document.addEventListener('click', function() {
  document.querySelector('#input').focus();
});

//retrieve settings
browser.storage.local.get(['aliases', 'colors']).then(function (res) {
  let settings = res;

  let aliases = [];
  let urls = [];
  
  if (settings.hasOwnProperty('colors'))
  {
    setColors(settings.colors);
  }

  if (settings.hasOwnProperty('aliases'))
  {

    for (let i = 0; i < settings.aliases.length; i++)
    {

      // is this really useful why sepaarate ?????
      aliases.push(settings.aliases[i].alias);
      urls.push(settings.aliases[i].url);
    }
  }

  
  document.addEventListener('keydown', function(e)
  {
      if (document.activeElement.tagName == 'INPUT' && e.key == 'Enter')
      {
        let query = document.querySelector('#input').value;

        //aliases
        let alias = query.split(' ')[0];//alias / cmd
        let arg = query.substring(alias.length + 1);
     

        if (aliases.indexOf(alias) > -1) //alias match
        {
          //alias
          let url = urls[aliases.indexOf(alias)];
      
          //matching aliases
          let matchs = getMatchAliases(settings.aliases, alias);

          console.log(matchs);
          console.log(matchs.length);
      
          if (matchs.length == 1)//single tab
          {
              url = url.replace('%s', arg);
              window.location.href = url;
          }
          else if (matchs.length > 1) //multi tab
          {
            for (let i = 0; i < matchs.length; i++)
            {
              //open new tab;
              if (i == 0)
                setTimeout(function () {
                  window.location.href = matchs[i].url;
                }, 300);
              else
                window.open(matchs[i].url, '_blank');
            }
          }
        }
        else if (query == ":settings")
        {
          //go to settings
          document.querySelector('div').classList.add('active');
          document.querySelector('textarea').focus();

          //write settings in textarea
          let text = '';
          for (let i = 0; i < settings.aliases.length; i++)
            text += settings.aliases[i].alias + ' ' + settings.aliases[i].url + '\n';
  
          if (settings.colors.hasOwnProperty('primary'))
            text += 'primaryColor' + ' ' + settings.colors.primary + '\n';
          if (settings.colors.hasOwnProperty('secondary'))
            text += 'secondaryColor' + ' ' + settings.colors.secondary + '\n';
          if (settings.colors.hasOwnProperty('font'))
            text += 'fontColor' + ' ' + settings.colors.font + '\n';

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

    //bof vim nav
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
        }  
        else if (e.key == 'l') //right
        {
          pos = getCaretPos();
          if (pos < input.value.length)
            setCaretPos(pos + 1);

        }
        else if (e.key == 'i')
        {
          mode = 'insert';
        }
        
        e.preventDefault();

      }
    //eof useful ????


  });
});


//set settings

document.querySelector('#submit').addEventListener('click', function () {

  
    let aliases = []; 
    let colors = {};

    //parse text settings
    let text = document.querySelector('textarea').value;
    let lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++)
    {
      let words = lines[i].split(' ');
      let setting = words[0];
      let value = words[1];

      if (setting == 'primaryColor')
      {
        colors.primary = value;
      }
      else if (setting == 'secondaryColor')
      {
        colors.secondary = value;
      }
      else if (setting == 'fontColor')
      {
        colors.font = value;
      }
      else if (setting != '' && setting != undefined && value != '' && value != undefined)
      {
        aliases.push({'alias': setting, 'url': value});
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

    browser.storage.local.set({'colors': colors}).then(
      function (res) {

        document.querySelector('div').classList.remove('active');
        location.reload();
        input.value = "";
        input.focus();
        
      }
    );
    
});

