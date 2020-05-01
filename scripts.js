//
var cellArray = [];
var turnedCnt = 0;

var picTheme = 'enna';
var picCover = './img/'+picTheme+'/cover.jpg';
var picArray = [];

var player1 = {
     name: "Player 1",
     color: "rgb(37, 103, 202)",
     points: 0,
     isPlaying: false
}

var player2 = {
    name: "Player 2",
    color: "rgb(179, 58, 104)",
    points: 0,
    isPlaying: false
}

function togglePlayer(){
    if(player1.isPlaying){
        player1.isPlaying = false;
        player2.isPlaying = true;
        document.getElementById("body").style.backgroundColor = player2.color;
        document.getElementById("divGame").style.backgroundColor = player2.color;
    }else{
        player2.isPlaying = false;
        player1.isPlaying = true;
        document.getElementById("body").style.backgroundColor = player1.color;
        document.getElementById("divGame").style.backgroundColor = player1.color;
    }
    document.getElementById("player1").innerHTML = player1.name + '|  ' +  player1.points + ' points';
    document.getElementById("player2").innerHTML = player2.name + '|  ' +  player2.points + ' points';
}

//
function initFields(dimension){
    cellsize = 500/dimension-5;
    var vDiv;
    var vTable;
    var vTr;
    var vTd;
    var cell;
    //
    console.log("initFieldsDyn("+dimension+")");

    // init array of pics
    for (i = 0; i <= (dimension*dimension)/2-1; i++){
        picArray.push({"index": i, "value": "./img/"+picTheme+"/"+(i+1)+".jpg", "usage" : 0});
    }
    console.log(picArray);

    function assignValue(index){
        var picIndex;
        //picIndex = picArray.findIndex(o => o.index === index);
        if(picArray[index].usage < 2){
            picArray[index].usage++;
            return picArray[index].value;
        } else {
            if (index+1 >= picArray.length){
                return assignValue(0);
            } else {
                return assignValue(index+1);
            }
        }
    }

    // int fields
    vDiv = document.getElementById("divGame");
    if(vDiv){
        vDiv.remove();
    }

    vDiv = document.createElement("div");
    vDiv.setAttribute("id", "divGame");
    vDiv.setAttribute("align", "center");
    document.getElementById("container-center").appendChild(vDiv);
    vTable = document.createElement("table");
    vTable.setAttribute("id", "tabGame");
    vTable.setAttribute("style", "border-spacing: 2px;");
    vTable.setAttribute("onmousedown", "turn(event)");
    document.getElementById("divGame").appendChild(vTable);
    for(i = 1; i <= dimension; i++){  
        vTr = document.createElement("tr");
        vTr.setAttribute("id", "row"+i);
        document.getElementById("tabGame").appendChild(vTr);
        for(j = 1; j <= dimension; j++){
            cell = {id: "row"+i+"col"+j,
                    row: i, 
                    col: j, 
                    img: assignValue(Math.round(Math.random()*100,2)%(dimension*dimension/2)),
                    turned: false,
                    matched: false,
                    turn: function(){this.turned = !this.turned}
                  };
            vTd = document.createElement("td");
            vTd.setAttribute("id", "row"+i+"col"+j);
            vTd.setAttribute("height", cellsize+"px");
            vTd.setAttribute("width", cellsize+"px");
            vTd.style.cursor = "pointer";
            vTd.style.backgroundImage = "url("+picCover+")";
            vTd.style.backgroundSize = "100% 100%";
            //vTd.style.background = 'red';
            //vTd.innerHTML =  cell.value;
            document.getElementById("row"+i).appendChild(vTd);
            cellArray.push(cell);
        }
    }
    switch(Math.round(Math.random()*10,2)%2 == 1){ case 1:player1.isPlaying = true; default: player2.isPlaying = true;}
    togglePlayer();
}
//
function turnBack(){
    for(i=0; i<=cellArray.length-1; i++){
        if(!cellArray[i].matched){ // disregard already matched
            if(cellArray[i].turned){
                console.log(i+"-"+cellArray[i].turned)
                cellArray[i].turned = false;
                document.getElementById(cellArray[i].id).style.transition = "5s";
                document.getElementById(cellArray[i].id).style.backgroundImage = "url("+picCover+")";
                document.getElementById(cellArray[i].id).style.backgroundSize = "100% 100%";
            }
        }
    }
}
//
function turn(e){
    var turnedCell1index = undefined;
    var turnedCell2index = undefined;
    console.log("--turn---"+e.target.id);
    var cellIndex = cellArray.findIndex(obj => obj.id == e.target.id);
    if(!cellArray[cellIndex].matched){
        if(cellArray[cellIndex].turned){ //open => close
            // do nothing
        }else if(turnedCnt<2){ // close => open
            console.log("--turn close => open--"+e.target.id);
            document.getElementById(e.target.id).style.transition = "0.5s";
            document.getElementById(e.target.id).style.backgroundImage = "url("+cellArray[cellIndex].img+")";
            document.getElementById(e.target.id).style.backgroundSize = "100% 100%";
            cellArray[cellIndex].turned = !cellArray[cellIndex].turned;
            turnedCnt++;
        } 
        if(turnedCnt>=2){ // check result
            console.log("--turn check result-"+e.target.id);
            for(i=0; i<=cellArray.length-1; i++){
                if(!cellArray[i].matched){ // disregard already matched
                    if(cellArray[i].turned){
                        if(turnedCell1index == undefined){
                            turnedCell1index = i;
                            console.log('turned1=' + turnedCell1index);
                        }else if(turnedCell2index == undefined){
                            turnedCell2index = i;
                            console.log('turned2=' + turnedCell2index);
                        }
                    }
                }
            }
            //console.log("turnedCell1index="+turnedCell1index);
            //console.log("turnedCell2index="+turnedCell2index);
            console.log("cellArray[turnedCell1index].img="+cellArray[turnedCell1index].img);
            console.log("cellArray[turnedCell2index].img="+cellArray[turnedCell2index].img);   
            if(cellArray[turnedCell1index].img == cellArray[turnedCell2index].img){ // the same
                console.log("--turn --check result --the same "+e.target.id);
                cellArray[turnedCell1index].matched = true;
                cellArray[turnedCell2index].matched = true;
                document.getElementById(cellArray[turnedCell1index].id).style.cursor = "context-menu";
                document.getElementById(cellArray[turnedCell2index].id).style.cursor = "context-menu";
                document.getElementById(cellArray[turnedCell1index].id).style.opacity = "20%";
                document.getElementById(cellArray[turnedCell2index].id).style.opacity = "20%";
                if(player1.isPlaying){
                    player1.points = player1.points+2;
                    document.getElementById(cellArray[turnedCell1index].id).style.backgroundColor = player1.color;
                    document.getElementById(cellArray[turnedCell2index].id).style.backgroundColor = player1.color;
                }else{
                    player2.points = player2.points+2;
                    document.getElementById(cellArray[turnedCell1index].id).style.backgroundColor = player2.color;
                    document.getElementById(cellArray[turnedCell2index].id).style.backgroundColor = player2.color;
                }
                document.getElementById("player1").innerHTML = player1.name + '|  ' +  player1.points + ' points';
                document.getElementById("player2").innerHTML = player2.name + '|  ' +  player2.points + ' points';
            }else{ // not the same
                console.log("--turn -not the same-"+e.target.id);
                setTimeout(turnBack,700);// turn back what was turned but is not matching
                togglePlayer();
            }
            turnedCnt = 0;
            turnedCell1index = undefined;
            turnedCell2index = undefined;
        }
    }
    console.log("turnedCnt="+turnedCnt);
}