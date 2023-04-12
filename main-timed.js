


mode="t";
var curr_secs;
document.getElementById("time").innerText=localStorage.getItem("time");
window.setTimeout(function(){
    endScreen();
},parseInt(localStorage.getItem("time"))*1000);
window.setInterval(function(){
    curr_secs = parseInt(document.getElementById("time").innerText);
    if(curr_secs>0){
        document.getElementById("time").innerText=curr_secs-1;
        localStorage.setItem("time",curr_secs-1);
    }
},1000)


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
            if(document.getElementById(box).style.background!="#93c47d"){
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
        localStorage.setItem("timer",curr_secs);
        winScreen();
        localStorage.setItem("wordss",JSON.stringify([...JSON.parse(localStorage.getItem("wordss") || "[]"),{date:date,word: gword, def: gdef, correct: true}])); //add to list of words
    }
    else if(row==4){                                                            
        /*if player ran out of rows/tries, input field is disabled, end screen is shown,
        the given word is added to the word history in local storage*/
        document.getElementById("text").disabled=true;
        
        localStorage.setItem("wordss",JSON.stringify([...JSON.parse(localStorage.getItem("wordss") || "[]"),{date:date,word: gword, def: gdef, correct: false}])); //add to list of words
        endScreen();
    }
    row++; // move to next row
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
}
