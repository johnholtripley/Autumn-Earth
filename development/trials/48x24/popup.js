function openpopup()
{
var pop_width = 800;
var pop_height = 450;

var screen_width = 760;
var screen_height = 420;

if (screen.width) {
screen_width = screen.width;
screen_height = screen.height;
}

var win_top = (screen_height-pop_height)/2;
var win_left = ((screen_width-pop_width)/2);
var newpopup=window.open('world.html?1','popupworld','height='+pop_height+',width='+pop_width+',left='+win_left+',screenX='+win_left+',top='+win_top+',screenY='+win_top);
}
