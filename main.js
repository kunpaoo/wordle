

window.onload=gen();
genTable();                                                            //when the window loads, it generates a word
document.querySelector("form").addEventListener("submit", e => {                //when the user enters a word, the word is placed in the boxes, and the input field is cleared
    e.preventDefault();
    placeWord();
    document.getElementById("text").value="";
});

var mode = "e";
var gword, gdef;  // global variable; word to be guessed, along with its definition
var d = new Date();
var date = (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear();

var row=0;    //tracks which row will be written

function placeWord(){                              
    /*
    places word to the boxes, checks input if it's the same as the given word, checks if player ran out of rows to input
    */

    var txt=document.getElementById("text").value.toLowerCase();                
    for(var x=0; x<txt.length; x++){                                            
        var box = x+1+(row*5);                                                  
        document.getElementById(box).innerText=txt[x];                          
        document.getElementById(txt[x].toLowerCase()).style.opacity="0.4";      
        if(gword[x]==txt[x]){                                                   
            document.getElementById(box).style.background="#93c47d";            
            document.getElementById(txt[x].toLowerCase()).style.background="#93c47d";
            document.getElementById(txt[x].toLowerCase()).style.opacity="1";   
        }
        else if(gword.includes(txt[x])){                                    
            if(document.getElementById(box).style.background!="#93c47d"){ //if not green
                document.getElementById(box).style.background="#ffd966";
                document.getElementById(txt[x].toLowerCase()).style.background="#ffd966";
            }    
            document.getElementById(txt[x].toLowerCase()).style.opacity="1";   
        }
        
    }
    if(txt==gword){                                                             
        /*if input is exactly the same as the given word, input field is disabled, 
        score in the local storage is added by 1, win screen is shown, and the given word is 
        added to the word history*/
        document.getElementById("text").disabled=true;                          
        localStorage.setItem("score",[parseInt(localStorage.getItem("score"))+1]);
        document.getElementById("score").innerHTML="Score: "+localStorage.getItem("score");
        winScreen();
        localStorage.setItem("wordss",JSON.stringify([...JSON.parse(localStorage.getItem("wordss") || "[]"),{date:date, word: gword, def: gdef, correct: true}])); //add to list of words
    }
    else if(row==4){                                                            
        /*if player ran out of rows/tries, input field is disabled, end screen is shown,
        the given word is added to the word history in local storage*/
        document.getElementById("text").disabled=true;
        localStorage.setItem("wordss",JSON.stringify([...JSON.parse(localStorage.getItem("wordss") || "[]"),{date:date, word: gword, def: gdef, correct: false}])); //add to list of words
        
        endScreen();
        
        
    }
    row++; // move to next row
}

function genTable(){
    var out = "";
    out+="<table>";
    for(var i=0; i<5; i++){
        out+="<tr>";
        for(var s=1+(5*i); s<6+(5*i);s++){
            out+="<td id='"+s+"'></td>";
        }
        out+="</tr>";

    }
    out+="</table>";
    document.getElementById("table").innerHTML=out;
    
}

function gen(){    //generates a word to be guessed. 
    /* generates a random number num from 1 to 50. chooses the "num"th word from the list 
    of words in the local text file. also chooses the "num"th definition from the list of definitions.
    shows the score so far. 
    */
    var num = Math.floor(1+Math.random()*50);
    fetch("sample_words.txt")
    .then(x => x.text())
    .then(y => setWord(y,num));

    fetch("word_def.txt")
    .then(x=>x.text())
    .then(y=> setDef(y,num));

    document.getElementById("score").innerHTML="Score: "+localStorage.getItem("score"); //view score
    document.getElementById("text").focus();
}

function reset(){
    localStorage.setItem("score",0);
    localStorage.setItem("time",300);
    localStorage.removeItem("wordss");
    location.reload();
}

function setWord(word,num){
    /* sets the word to be guessed. converts the data from the text file to String. 
    creates an array of the words which are split by line breaks.
    sets the given word to the word in the "num"th position
     */
    word=word.toString();
    var words=word.split("\r\n");
    gword=words[num-1];
}

function setDef(word,num){
    /* sets definition of the word to be guessed. converts the data from the text file to String. 
    creates an array of the words which are split by line breaks.
    sets the definition to the words in the "num"th position
     */
    word=word.toString();
    var words=word.split("\r\n");
    gdef=words[num-1];
}

function winScreen(){
    /*
    shows the screen when user guessed the word correctly. it adds a small card on the center of the screen 
    with a next button which will reload the page when clicked, signifying another round.
    */
    document.getElementById("body").innerHTML+=`<div class="end-screen"><b>Correct!</b>
    <div class="card">`+gword+` - <i>`+gdef+`</i>`+
    `</div>
    <button id="next" onclick="location.reload()">Next</button></div>`;
}

function endScreen(){
    /*
    shows the screen when user ran out of tries. it adds a small card on the center of the screen 
    with a main menu button that redirects the player to the main menu, and a review button which will
    redirect the player to the word history.
    */
   
    var player_name = window.prompt("Enter player name here");
    
    localStorage.setItem("player",JSON.stringify([...JSON.parse(localStorage.getItem("player") || "[]"),{mode:mode,name: player_name, score: localStorage.getItem("score"), wordlist:JSON.parse(localStorage.getItem("wordss"))}]));
    
    localStorage.removeItem("wordss"); //reset word history
    
    document.getElementById("body").innerHTML+=`<div class="end-screen"><b>Game Over</b>
    <div class="card">`+gword+` - <i>`+gdef+`</i>`+
    `</div>
    <div class="flex flex-row justify-center gap-1">
    <button id="next" onclick="reset()">Play Again</button>
    <button id="next" onclick="window.location.href='scoreboard.html'">Scoreboard</button>
    </div>
    <button id="next" style="margin-top:8px;" onclick="window.location.href='review.html'">Review</button>
    <button id="next" style="margin-top:8px;" onclick="window.location.href='main.html'">Main Menu</button>
    </div>`;
}



