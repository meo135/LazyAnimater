const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');

//var glo_imageSrc = "https://pbs.twimg.com/media/EoRpP7nVoAANG4O.jpg";
var glo_imageSrc = "face.png";
var imagesArray = [];

var glo_image = new Image();
glo_image.src = glo_imageSrc;

var glo_scaleRate = 1;  //圖片整體縮小
var center_width; //左右置中
var center_height;


//畫布位置(滑鼠座標修正)
let offsetLeft = canvas.getBoundingClientRect().left;
let offsetTop = canvas.getBoundingClientRect().top;

var radius = 5;  //定位點半徑
var down = false;
//var glo_up = false;
var count = 0; //幾個動畫div
var conSize = 0;

var fix = 8; //修補用div變小多少
var colorCode = "#fee9e2";       
//var colorCode = "red"; 
var temp_height;
var glo_click = false;

//眼動畫 
var eye_fps = [];  //眼睛動畫影格   
var move = 1;  //==i，會變
var stop = 600; //delay幾貞
//var start = null;    
var i = 1;     //常數
var eye_down = true;
var speed = 0.13;  //越小動畫越慢，不超過1
//var delay = 3000;
var counter = 0;  //跑到第幾貞
var temp_mouseEndy;
var temp_mouseStarty; 
var temp_mouseEndy2;
var temp_mouseStarty2;
var glo_squez = 0.2;  //眼睛單一部分壓縮

//嘴動畫
var mouth_fps = [];
var m_speed = 0.001;
var m_counter = 0;
var m_move = 1;
var m_stop = 0; //delay幾貞
var m_i = 1;
var temp_mouseEndy3;
var temp_mouseStarty3;
var mouth_squez = 0.92; 

//呼吸動畫
var breathe_fps = [];
var b_speed = 0.0002;  //目前是常數?
var b_counter = 200;
var b_move = 1;
var b_stop = 0; //delay幾貞
var b_i = 1;
var temp_mouseEndy4;
var temp_mouseStarty4;
var breathe_squez = 0.98;
var slow = 2;  //越大動畫越慢，但看起來卡
var b_fix = 1; //誤差加幾px


/*滑鼠座標 */
let glo_mouseStart = {
    x : 0,
    y : 0,
}

let glo_mouseEnd = {
    x : 0,
    y : 0,
}

let glo_draw = {
    x : 0,
    y : 0,
}


glo_image.onload = function(){  //畫布上的img      
    //context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight); 
    ctx.fillStyle = "#242424";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    //如果img超過畫布
    if(glo_image.height > canvas.height)glo_scaleRate = canvas.height/glo_image.height;
    glo_scaleRate *= 0.95;
    $('#scale_rate').val(glo_scaleRate);
    //console.log(glo_image.height);  
    //console.log(canvas.height);  
    //console.log(glo_scaleRate);

    center_width = (canvas.width - glo_image.width*glo_scaleRate)/2;
    center_height = (canvas.height - glo_image.height*glo_scaleRate)/2;
    ctx.drawImage(glo_image, center_width, center_height, glo_image.width*glo_scaleRate, glo_image.height*glo_scaleRate);    
    /*
    console.log(`origin: ${sWidth},${sHeight}`);
    console.log(`scale: ${sWidth*glo_scaleRate},${sHeight*glo_scaleRate}`);
    */    
}

function rescale(){  //畫布上的img調整       
    ctx.fillStyle = "#242424";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    $('#scale_rate').val(glo_scaleRate);   
    
    center_width = (canvas.width - glo_image.width*glo_scaleRate)/2;
    center_height = 0;
    ctx.drawImage(glo_image, center_width, center_height, glo_image.width*glo_scaleRate, glo_image.height*glo_scaleRate);    
    
}
/*
const fileSelector = document.getElementById('input');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    //console.log(fileList);
    imagesArray.push(fileList[0]);
    //glo_image =  window.URL.createObjectURL(imagesArray[0]);
    //console.log(glo_image);
    //rescale();
});
*/

/*
function inputImg(){
    var selectedFile =  document.getElementById('input').files[0];
    console.log(selectedFile);
}
*/

$('#eye_button').click(function(){
    console.log("eye_button click!");
    count = 2;
    $('#status').html("status: mouth");
    window.requestAnimationFrame(ani_eye);         
});

$('#mouth_button').click(function(){
    console.log("mouth_button click!");
    $('#status').html("status: breathe");
    count = 3;               
});

$('#scale_button').click(function(){
    console.log("scale click!");    
    glo_scaleRate = $('#scale_rate').val();
    rescale();  
});

$('#img_button').click(function(){
    console.log("img click!");    
    glo_image.src = $('#img_url').val();
    rescale();  
});

$('#color_button').click(function(){
    console.log("color_button click!");
    var color_change = $('#color_code').val();
    if(count==1){
        $('#color1').css("background-color", color_change);   
        $('#color1').css("boxShadow", `0px 0px ${fix/3.5}px 3px ${color_change}`); 
    }else if(count==2){
        $('#color2').css("background-color", color_change);   
        $('#color2').css("boxShadow", `0px 0px ${fix/3.5}px 3px ${color_change}`); 
    }else if(count==3){
        $('.mouth').css("background-color", color_change);   
        $('.mouth').css("boxShadow", `0px 0px ${fix/3.5}px 3px ${color_change}`);
    }else if(count==4){
        $('.breathe').css("background-color", color_change);   
        $('.breathe').css("boxShadow", `0px 0px ${fix/3.5}px 3px ${color_change}`);
    }    
});

$('#scale_button').remove();
$('#scale_rate').remove();  //移除隱藏scale


addEventListener('wheel', (event) => {
    console.log(event.deltaY);
    glo_scaleRate += event.deltaY*0.0003*(-1);
    rescale();
});


$(document).keydown(function(event){
    if(event.keyCode == 32){
        console.log("keydown!");
    }             
});

window.addEventListener('mousedown',(event) => {
//$('#mycanvas').mousedown(function(){    

    //在這裡把滑鼠座標寫到物件mouse中
    /*
    mouse.x = event.pageX;
    mouse.y = event.pageY;
    */
    glo_mouseStart.x = event.clientX - offsetLeft;
    glo_mouseStart.y = event.clientY - offsetTop;
   //if(glo_mouseStart.x<=canvas.width && glo_mouseStart.y<=canvas.height){        

    console.log(`glo_mouseStart: x=${glo_mouseStart.x}, y=${glo_mouseStart.y}`);
    if(glo_mouseStart.x>=canvas.width || glo_mouseStart.y>=canvas.height)return 0;

    //加一
    count++;

    //新增拖拉div
    var drag = document.createElement('DIV');
    //drag.style.width = "200px";
    //drag.style.height = "200px";
    drag.style.border = "1px solid red";
    drag.style.position = "absolute";
    drag.id = "drag" + count;
    document.body.appendChild(drag);        

    //標示定位點    
    /*
    ctx.beginPath();
    ctx.arc(glo_mouseStart.x,glo_mouseStart.y,radius,0,Math.PI*2);    
    ctx.strokeStyle="#FF5511";
    ctx.stroke();    
    ctx.fillStyle="#FFFF00";
    ctx.fill();
    */ 

    down = true;
    //}
//});
})

window.addEventListener('mousemove',(event) => {
//$('#mycanvas').mousemove(function(){    
    if(down){      

       glo_draw.x = event.clientX - offsetLeft;
       glo_draw.y = event.clientY - offsetTop;

               //console.log(`drawPos: x=${draw.x}, y=${draw.y}`);

        //拖拉       
        $(`#drag${count}`).css("left", glo_mouseStart.x + offsetLeft);  
        $(`#drag${count}`).css("top", glo_mouseStart.y + offsetTop);   
        $(`#drag${count}`).css("width",glo_draw.x - glo_mouseStart.x);
        $(`#drag${count}`).css("height",glo_draw.y - glo_mouseStart.y);
        
        
        //畫布
        //ctx.globalAlpha = 0.2;
        //ctx.strokeStyle="#FFFF00";       
        //ctx.fillStyle="#FF5511";
        //ctx.strokeRect(glo_mouseStart.x, glo_mouseStart.y,glo_draw.x - glo_mouseStart.x,glo_draw.y - glo_mouseStart.y);
    }  

    //console.log("point moving!");
    $(`#point${count}`).css("left", event.clientX - offsetLeft);  
    $(`#point${count}`).css("top", event.clientY - offsetTop); 

//});  
})


window.addEventListener('mouseup',(event) => {
//$('#mycanvas').mouseup(function(){
    //在這裡把滑鼠座標寫到物件mouse中
    /*
    mouse.x = event.pageX;
    mouse.y = event.pageY;
    */
    glo_mouseEnd.x = event.clientX - offsetLeft;
    glo_mouseEnd.y = event.clientY - offsetTop;
    

    //if(glo_mouseEnd.x<=canvas.width && glo_mouseEnd.y<=canvas.height){

    console.log(`glo_mouseEnd: x=${glo_mouseEnd.x}, y=${glo_mouseEnd.y}`);
    if(glo_mouseEnd.x>=canvas.width || glo_mouseEnd.y>=canvas.height)return 0;

    //起點終點互換
    /*
    if(glo_mouseStart.x > glo_mouseEnd.x){
        var t = glo_mouseStart.x;
        glo_mouseStart.x = glo_mouseEnd.x;
        glo_mouseEnd.x = t;
    }
    if(glo_mouseStart.y > glo_mouseEnd.y){
        var t = glo_mouseStart.y;
        glo_mouseStart.y = glo_mouseEnd.y;
        glo_mouseEnd.y = t;
    }
    */
    
    //標示定位點
    //ctx.globalAlpha = 1;
    /*
    ctx.beginPath();
    ctx.arc(glo_mouseEnd.x,glo_mouseEnd.y,radius,0,Math.PI*2);    
    ctx.strokeStyle="#FFFF00";
    ctx.stroke();    
    ctx.fillStyle="#FF5511";
    ctx.fill();
    */

    $(`#drag${count}`).css("border", "none");  //drag border

    down = false; 
    if(count==2){
        temp_mouseEndy2 = glo_mouseEnd.y;
        temp_mouseStarty2 = glo_mouseStart.y;
    }else if(count==3){
        temp_mouseEndy3 = glo_mouseEnd.y;
        temp_mouseStarty3 = glo_mouseStart.y;
    }

    //步驟
    if(count<=2){
        init_color(); 
        init_eye(); 
    }else if (count==3){
        init_color();
        init_mouth();
    }else if (count==4){
        
        init_color();
        init_breathe();
        
    }
          
    
    console.log(count);
    //conSize = Math.abs((glo_mouseEnd.x - glo_mouseStart.x));
    //console.log(conSize);
    //putImage();
    //}
//});
})

function readURL(input){

    if(input.files && input.files[0]){
  
      //var imageTagID = input.getAttribute("targetID");
  
      var reader = new FileReader();
  
      reader.onload = function (e) {
  
         //var img = document.getElementById(imageTagID);
  
         //img.setAttribute("src", e.target.result)
         console.log(e.target.result);
         glo_image.src = e.target.result;
         rescale();
  
      }
  
      reader.readAsDataURL(input.files[0]);
  
    }
  
  }

function init_color(){
    //增加修補膚色的div 
    var color = document.createElement('DIV');
    color.style.width =glo_draw.x - glo_mouseStart.x - fix + "px";
    color.style.height =glo_draw.y - glo_mouseStart.y - fix + "px";
    color.style.backgroundColor = colorCode;
    color.style.position = "absolute";
    color.style.borderRadius = "10px";
    color.style.left = fix/2 + "px";    
    color.style.top = fix/2 + "px"; 
    color.style.boxShadow = `0px 0px ${fix/3.5}px 2px ${colorCode}`;
    color.id = "color" + count;
    color.classList.add("color");
    
    if(count<=2){  //給不同class
        color.classList.add("eye");
    }else if(count==3){
        color.classList.add("mouth");
    }else if(count==4){
        color.classList.add("breathe");
    }

    $(`#drag${count}`).append(color);    

}

function init_mouth(){
    console.log("init_mouth!");
    //增加裝img的div
    var con = document.createElement('DIV');
    con.style.width =glo_draw.x - glo_mouseStart.x + "px";
    con.style.height = (glo_draw.y - glo_mouseStart.y)*mouth_squez + "px";
    //con.style.height = (draw.y - glo_mouseStart.y) + "px";
    //con.style.border = "1px solid gray";   //邊界
    con.style.position = "absolute";
    con.style.bottom = `${ (glo_draw.y - glo_mouseStart.y)/2 - 
        (glo_draw.y - glo_mouseStart.y)*mouth_squez/2}px`;
    con.style.overflow = "hidden";  //DEBUG
    con.id = "con" + count;
    con.classList.add("con");
    //con.classList.add("mouth");
    $(`#drag${count}`).css("z-index", "10");
    $(`#drag${count}`).append(con);

    //$(`#con${count}`).css("background-image", 'url("shotai.png")');
    var image = new Image();
    image.src = glo_image.src;
    //image.style.transformOrigin = "0px 0px";
    image.style.transformOrigin = `0px ${image.height}px`;
    image.style.transform = `scale(${glo_scaleRate},${glo_scaleRate*mouth_squez})`;    
    image.id = "img" + count;
    image.classList.add("img");

    image.style.position = "absolute";
    image.style.left = glo_mouseStart.x*-1 + center_width + "px";  
    image.style.top = (image.height - (glo_mouseEnd.y - glo_mouseStart.y)*mouth_squez)*-1 
        + (image.height*glo_scaleRate - glo_mouseEnd.y)*mouth_squez + center_height+ "px"; 

    $(`#con${count}`).append(image); 

    if(count==3){
        init_mfps(m_speed);
        window.requestAnimationFrame(ani_mouth);
    }
}

function init_eye(){
    console.log("init_eye!");    
    //增加裝img的div
    var con = document.createElement('DIV');
    con.style.width =glo_draw.x - glo_mouseStart.x + "px";
    con.style.height = (glo_draw.y - glo_mouseStart.y)*glo_squez + "px";
    //con.style.height = (draw.y - glo_mouseStart.y) + "px";
    //con.style.border = "1px solid gray";   //邊界
    con.style.position = "absolute";
    con.style.bottom = "0px";
    con.style.overflow = "hidden";  //DEBUG
    con.id = "con" + count;
    con.classList.add("con");
    //con.classList.add("eye");
    $(`#drag${count}`).css("z-index", "10");
    $(`#drag${count}`).append(con);

    //$(`#con${count}`).css("background-image", 'url("shotai.png")');
    var image = new Image();
    image.src = glo_image.src;
    //image.style.transformOrigin = "0px 0px";
    image.style.transformOrigin = `0px ${image.height}px`;
    image.style.transform = `scale(${glo_scaleRate},${glo_scaleRate*glo_squez})`;    
    image.id = "img" + count;
    image.classList.add("img");

    image.style.position = "absolute";
    image.style.left = glo_mouseStart.x*-1 + center_width  + "px";  
    image.style.top = (image.height - (glo_mouseEnd.y - glo_mouseStart.y)*glo_squez)*-1 
        + (image.height*glo_scaleRate - glo_mouseEnd.y)*glo_squez + center_height + "px"; 

    $(`#con${count}`).append(image); 

    if(count==1){
        init_fps(speed);
        temp_mouseEndy = glo_mouseEnd.y;
        temp_mouseStarty = glo_mouseStart.y;        
        temp_height = temp_mouseEndy - temp_mouseStarty;  
        /*
        console.log(temp_mouseEndy);
        console.log(temp_mouseStarty);
        console.log(temp_height);
        */
    }else if(count==2){         
        //glo_click = true;
        window.requestAnimationFrame(ani_eye); 
    }

}

function init_breathe(){
    console.log("init_breathe!");    
        
    //增加裝img的div
    var con = document.createElement('DIV');
    con.style.width =glo_draw.x - glo_mouseStart.x + "px";
    con.style.height = (glo_draw.y - glo_mouseStart.y)*breathe_squez + "px";
    //con.style.height = (draw.y - glo_mouseStart.y) + "px";
    //con.style.border = "1px solid gray";   //邊界
    con.style.position = "absolute";
    con.style.bottom = "0px";
    con.style.overflow = "hidden";  //DEBUG
    con.id = "con" + count;
    con.classList.add("con");
    //con.classList.add("eye");
    $(`#drag${count}`).css("z-index", "0");
    $(`#drag${count}`).append(con);

    //$(`#con${count}`).css("background-image", 'url("shotai.png")');
    var image = new Image();
    image.src = glo_image.src;
    //image.style.transformOrigin = "0px 0px";
    image.style.transformOrigin = `0px ${image.height}px`;
    image.style.transform = `scale(${glo_scaleRate},${glo_scaleRate*breathe_squez})`;    
    image.id = "img" + count;
    image.classList.add("img");

    image.style.position = "absolute";
    image.style.left = glo_mouseStart.x*-1 + center_width + "px";  
    image.style.top = (image.height - (glo_mouseEnd.y - glo_mouseStart.y)*breathe_squez)*-1 
        + (image.height*glo_scaleRate - glo_mouseEnd.y)*breathe_squez + center_height +"px"; 

    $(`#con${count}`).append(image); 

    if(count==4){
        init_bfps(b_speed);
        temp_mouseEndy4 = glo_mouseEnd.y;
        temp_mouseStarty4 = glo_mouseStart.y;        

        window.requestAnimationFrame(ani_breathe); 

        //temp_height = temp_mouseEndy - temp_mouseStarty;  
        /*
        console.log(temp_mouseEndy);
        console.log(temp_mouseStarty);
        console.log(temp_height);
        */
    }
    
    

}


function spinPoint(){
    console.log("spinPoint");    
    //增加裝img的div
    var con = document.createElement('DIV');
    con.style.width = "10px";
    //con.style.height = (glo_draw.y - glo_mouseStart.y)*glo_squez + "px";
    con.style.height = "10px";
    //con.style.border = "1px solid gray";   //邊界
    con.style.backgroundColor = "red";
    con.style.borderRadius = "50%";
    con.style.position = "absolute"; 
    //con.style.transformOrigin = ""  
    
    con.id = "point" + count;
    con.classList.add("point");
    //con.classList.add("eye");
    $("body").append(con);
}

//眼動畫
function ani_eye() {
    //if(glo_click)return;
    i = eye_fps[counter];
    if(count<=2)$('#status').html("status: mouth");
    //console.log("ani_eye start!");

    //var image = $('#img1');    
    //console.log(i);
    //if (!start) start = timestamp;
    //var progress = timestamp - start;
    //if(count==1){              
        
        /*
        $('#con1').css("height", (glo_mouseEnd.y - glo_mouseStart.y)*i + "px");
        $('#img1').css("top", (glo_image.height - (glo_mouseEnd.y - glo_mouseStart.y)*i)*-1 
            + (glo_image.height*glo_scaleRate - glo_mouseEnd.y)*i + "px");
        $('#img1').css("transform", `scale(${glo_scaleRate},${glo_scaleRate*i})`);
        */
        /*
        var temp_height = (glo_draw.y - glo_mouseStart.y)*i;
        var temp_top = (glo_image.height - (glo_mouseEnd.y - glo_mouseStart.y)*i)*-1 
            + (glo_image.height*glo_scaleRate - glo_mouseEnd.y)*i;
        var temp_scale = `scale(${glo_scaleRate},${glo_scaleRate*i})`;
        */

    //}else 
    if (count>=2){    
        //console.log("count==2 && glo_up!");
        $('#con1').css("height", temp_height*i + "px");
        $('#img1').css("top", (glo_image.height - (temp_mouseEndy - temp_mouseStarty)*i)*-1 
            + (glo_image.height*glo_scaleRate - temp_mouseEndy)*i + center_height + "px");
        $('#img1').css("transform", `scale(${glo_scaleRate},${glo_scaleRate*i})`);       
               

        $('#con2').css("height", (temp_mouseEndy2 - temp_mouseStarty2)*i + "px");
        $('#img2').css("top", (glo_image.height - (temp_mouseEndy2 - temp_mouseStarty2)*i)*-1 
            + (glo_image.height*glo_scaleRate - temp_mouseEndy2)*i + center_height + "px");
        $('#img2').css("transform", `scale(${glo_scaleRate},${glo_scaleRate*i})`);

        //glo_click = true;
    }
    
    /*
    if(i<=0)down = false;
    if(i>=1)down = true;
    console.log(down);
    if(down)i -= speed;
    else if(!down)i += speed;
    */
    /*
    if(i>=1 || i<=0) {
        speed *= -1;
    }
    i += speed;
    */
    
    //跑過整個陣列
    counter++;
    if(counter>eye_fps.length*50)counter = 0;
    counter = counter%eye_fps.length;
    window.requestAnimationFrame(ani_eye);
    
    /*
    if(i>=1){            
        setTimeout(() => {
            //console.log("Delayed for 1 second.");
            window.requestAnimationFrame(step);
        }, delay)
    }else{
        window.requestAnimationFrame(step);
    }
    */
    
    //if (progress < 5000) {
        //window.requestAnimationFrame(step);
    //}
}

function ani_mouth() {
    
    m_i = mouth_fps[m_counter];
    if(count==3)$('#status').html("status: breathe"); 
    
    //console.log("ani_eye start!");
    
    if (count>=3){    
        //console.log("count >= 3"); 
                
               
        /*
        $('#con3').css("height", (temp_mouseEndy2 - temp_mouseStarty2)*m_i + "px");
        $('#img3').css("top", (glo_image.height - (temp_mouseEndy2 - temp_mouseStarty2)*m_i)*-1 
            + (glo_image.height*glo_scaleRate - temp_mouseEndy2)*m_i + "px");
        $('#img3').css("transform", `scale(${glo_scaleRate},${glo_scaleRate*i})`);
        */

        $('#con3').css("height", (temp_mouseEndy3 - temp_mouseStarty3)*m_i + "px");
        $('#con3').css("bottom", (temp_mouseEndy3 - temp_mouseStarty3)*mouth_squez/2*(1-m_i) + "px");
        $('#img3').css("transform", `scale(${glo_scaleRate},${glo_scaleRate*m_i})`);
        $('#img3').css("top", (glo_image.height - (temp_mouseEndy3 - temp_mouseStarty3)*m_i)*-1 
          + (glo_image.height*glo_scaleRate - temp_mouseEndy3)*m_i + center_height + "px");
        /*
        image.style.left = glo_mouseStart.x*-1 + center_width  + "px";  
        image.style.top = (image.height - (glo_mouseEnd.y - glo_mouseStart.y)*glo_squez)*-1 
        + (image.height*glo_scaleRate - glo_mouseEnd.y)*glo_squez + center_height + "px";
        */

        //glo_click = true;
    }    
   
    //跑過整個陣列
    m_counter++;
    if(m_counter>mouth_fps.length*50)m_counter = 0;
    m_counter = m_counter%mouth_fps.length;
    window.requestAnimationFrame(ani_mouth);    
    
}

function ani_breathe() {
    //if(glo_click)return;
    b_i = breathe_fps[b_counter];
    if(count==4)$('#status').html("status: done");
    //console.log("ani_breathe start!");

    //var image = $('#img1');    
    //console.log(i);
    //if (!start) start = timestamp;
    //var progress = timestamp - start;
    //if(count==1){              
        
        /*
        $('#con4').css("height", (temp_mouseEndy4 - temp_mouseStarty4)*i + "px");
        $('#img4').css("top", (glo_image.height - (temp_mouseEndy4 - temp_mouseStarty4)*i)*-1 
            + (glo_image.height*glo_scaleRate - temp_mouseEndy4)*i + "px");
        $('#img4').css("transform", `scale(${glo_scaleRate},${glo_scaleRate*i})`);
        */
        
        /*
        var temp_height = (glo_draw.y - glo_mouseStart.y)*i;
        var temp_top = (glo_image.height - (glo_mouseEnd.y - glo_mouseStart.y)*i)*-1 
            + (glo_image.height*glo_scaleRate - glo_mouseEnd.y)*i;
        var temp_scale = `scale(${glo_scaleRate},${glo_scaleRate*i})`;
        */

    //}else 
    if (count>=4){    
        //console.log("count>=4!");         
               
        $('#con4').css("height", (temp_mouseEndy4 - temp_mouseStarty4)*b_i + "px");
        $('#img4').css("top", (glo_image.height - (temp_mouseEndy4 - temp_mouseStarty4)*b_i)*-1 
            + (glo_image.height*glo_scaleRate - temp_mouseEndy4)*b_i + center_height + "px");
        $('#img4').css("transform", `scale(${glo_scaleRate},${glo_scaleRate*b_i})`);

        //$('#con1').style.top = (temp_mouseEndy4 - temp_mouseStarty4)*b_i + "px";
        //$('#drag1').css("top", (temp_mouseStarty+ offsetTop) 
        //   + (temp_mouseEndy4 - temp_mouseStarty4)*(1 - b_i)
        //    - (temp_mouseEndy - temp_mouseStarty)*(1-breathe_squez) + "px");
        $('#drag1').css("top", (temp_mouseStarty+ offsetTop) 
            + (temp_mouseEndy4 - temp_mouseStarty4)*(1 - b_i)-((1-b_i)*180) + "px");
        $('#drag2').css("top", (temp_mouseStarty2+ offsetTop) 
           + (temp_mouseEndy4 - temp_mouseStarty4)*(1 - b_i)-((1-b_i)*180) + "px");
        $('#drag3').css("top", (temp_mouseStarty3+ offsetTop) 
           + (temp_mouseEndy4 - temp_mouseStarty4)*(1 - b_i)-((1-b_i)*180)  + "px");  
        

        //glo_click = true;
    }
    
    /*
    if(i<=0)down = false;
    if(i>=1)down = true;
    console.log(down);
    if(down)i -= speed;
    else if(!down)i += speed;
    */
    /*
    if(i>=1 || i<=0) {
        speed *= -1;
    }
    i += speed;
    */
    
    //跑過整個陣列
    b_counter++;
    if(b_counter>breathe_fps.length*50)b_counter = 0;
    b_counter = b_counter%breathe_fps.length;
    window.requestAnimationFrame(ani_breathe);

    console.log(b_counter);
    
    /*
    if(i>=1){            
        setTimeout(() => {
            //console.log("Delayed for 1 second.");
            window.requestAnimationFrame(step);
        }, delay)
    }else{
        window.requestAnimationFrame(step);
    }
    */
    
    //if (progress < 5000) {
        //window.requestAnimationFrame(step);
    //}
}


function init_bfps(speed){
    while(b_move>=breathe_squez){
        for(var i= 0; i<slow; i++){
            breathe_fps.push(b_move);
        }               
        b_move -= b_speed;
    }
    b_move = breathe_squez;
    while(b_move<=1){
        for(var i= 0; i<slow; i++){
            breathe_fps.push(b_move);
        } 
        b_move += b_speed;
    }
    for(var i=0; b_i<b_stop; b_i++){
        breathe_fps.push(1);
    }
    console.log(breathe_fps);
}

function init_mfps(speed){    
    while(m_move>=mouth_squez){
        mouth_fps.push(m_move);
        m_move -= m_speed;
    }
    m_move = mouth_squez;
    while(m_move<=1){
        mouth_fps.push(m_move);
        m_move += m_speed;
    }
    for(var i=0; m_i<m_stop; m_i++){
        mouth_fps.push(1);
    }
    console.log(mouth_fps);
}

function init_fps(speed){
    while(move>=glo_squez){
        eye_fps.push(move);
        move -= speed;
    }
    move = glo_squez;
    while(move<=1){
        eye_fps.push(move);
        move += speed;
    }
    for(var i=0; i<stop; i++){
        eye_fps.push(1);
    }
    console.log(eye_fps);
}

/*後面是廢棄函式 */






/*
    function step(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        $('#con1').css("height", (draw.y - glo_mouseStart.y)*i + "px");
        $('#img1').css("top", (image.height - (glo_mouseEnd.y - glo_mouseStart.y)*i)*-1 
            + (image.height*glo_scaleRate - glo_mouseEnd.y)*i + "px");
        $('#img1').css("transform", `scale(${glo_scaleRate},${glo_scaleRate*i})`);
        
        if(i<=0)down = false;
        if(i>=1)down = true;
        console.log(down);
        

        if(down)i -= speed;
        else if(!down)i += speed;

        if(i>=1){            
            setTimeout(() => {
                //console.log("Delayed for 1 second.");
                window.requestAnimationFrame(step);
            }, delay)
        }else{
            window.requestAnimationFrame(step);
        }
        
        
        //if (progress < 5000) {
            //window.requestAnimationFrame(step);
        //}
    }
    */









































function putImage(){


    var image_1 = new Image();
    image_1.src = glo_imageSrc;    
    
    
    //image_1.style.transform = `scale(${glo_scaleRate})`;

    image_1.style.marginLeft = glo_mouseStart.x*-1 + "px";
    image_1.style.marginTop = glo_mouseStart.y*-1 + "px";    

    
    var container = document.createElement('DIV');
    container.style.width = (glo_mouseEnd.x - glo_mouseStart.x) + "px";
    container.style.height = (glo_mouseEnd.y - glo_mouseStart.y) + "px";
    container.style.position = "absolute";
    container.style.border = "1px solid blue";
    container.style.overflow = "hidden";
    container.id="con" + count;

    container.style.left = (glo_mouseStart.x + offsetLeft) + 'px';
    container.style.top = (glo_mouseStart.y + offsetTop) + 'px';   
    
    var trans = document.createElement('DIV');
    trans.style.width = "100%";
    trans.style.height = "100%";
    //trans.style.border = "2px solid yellow";
    trans.id="trans" + count;

    animationTest();

    //測試變形    
    function animationTest(){
        var glo_squez = 0.5;
        //var fix = 0;  /*還沒算!!和conSize相關? */
        //image_1.style.transform = `scale(1)`;

        //壓縮影像          
        //image_1.style.transformOrigin = `${(glo_mouseEnd.x + glo_mouseStart.x)/2*glo_scaleRate 
        //    - (glo_mouseEnd.x + glo_mouseStart.x)/2}px ${glo_mouseEnd.y*glo_scaleRate}px`; 
        //image_1.style.transformOrigin = `0px ${glo_mouseEnd.y}px`;
        image_1.style.transformOrigin = "0px 0px";
        console.log("origin=" + image_1.style.transformOrigin);        
        image_1.style.transform = `scale(${glo_scaleRate}, ${glo_squez*glo_scaleRate})`;           

        //調整影像位置        
        //image_1.style.marginTop = glo_mouseEnd.y*glo_scaleRate*-1 + "px"; 
        image_1.style.marginTop = "0px"; 
        //image_1.style.marginTop = "-90px";
        //image_1.style.marginLeft = "-100px";

        
        //改變裁切範圍和大小
                
        container.style.height = (glo_mouseEnd.y - glo_mouseStart.y)*glo_squez + "px";
        container.style.top = (glo_mouseStart.y + offsetTop) 
            + ((glo_mouseEnd.y - glo_mouseStart.y)- (glo_mouseEnd.y - glo_mouseStart.y)*glo_squez) + "px";
        

        //var test = trans.clientHeight;
        //console.log(test);

        //image_1.style.marginTop = glo_mouseStart.y*-1 + container.height - (container.height)*glo_squez + "px";
        //image_1.style.marginTop = (glo_mouseEnd.y - glo_mouseStart.y)*-0.3 + glo_mouseStart.y*-1 + "px";
    }
    
    

    document.body.appendChild(container);
    container.appendChild(trans);
    trans.appendChild(image_1);
    



    //document.body.appendChild(image_1);

    //image_1.style.transform = `scale(${glo_scaleRate})`;
    //image_1.style.transform = "scale(0.7)";
       
    //ctx.drawImage(image_1, glo_mouseStart.x/glo_scaleRate, glo_mouseStart.y/glo_scaleRate, (glo_mouseEnd.x - glo_mouseStart.x)/glo_scaleRate, 
    //    (glo_mouseEnd.y - glo_mouseStart.y)/glo_scaleRate, glo_mouseStart.x, glo_mouseStart.y, glo_mouseEnd.x - glo_mouseStart.x, glo_mouseEnd.y - glo_mouseStart.y); 

    
    //ctx.drawImage(image, 0, 0, sWidth*glo_scaleRate, sHeight*glo_scaleRate);    
    /*
    console.log(`origin: ${sWidth},${sHeight}`);
    console.log(`scale: ${sWidth*glo_scaleRate},${sHeight*glo_scaleRate}`);
    */
}

function newImage(){


    var image_1 = new Image();
    image_1.src = glo_imageSrc;

    //image_1.style.transform = `scale(${glo_scaleRate})`;
    //image_1.style.transform = "scale(0.7)";
       
    ctx.drawImage(image_1, glo_mouseStart.x/glo_scaleRate, glo_mouseStart.y/glo_scaleRate, (glo_mouseEnd.x - glo_mouseStart.x)/glo_scaleRate, 
        (glo_mouseEnd.y - glo_mouseStart.y)/glo_scaleRate, glo_mouseStart.x, glo_mouseStart.y, glo_mouseEnd.x - glo_mouseStart.x, glo_mouseEnd.y - glo_mouseStart.y); 

    image_1.style.transform = "scale(2)";
    //ctx.drawImage(image, 0, 0, sWidth*glo_scaleRate, sHeight*glo_scaleRate);    
    /*
    console.log(`origin: ${sWidth},${sHeight}`);
    console.log(`scale: ${sWidth*glo_scaleRate},${sHeight*glo_scaleRate}`);
    */
}

