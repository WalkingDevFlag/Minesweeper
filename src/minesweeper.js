function Minesweeper(e,t){var i,n,s,a,o,r,d,u,l,c,f,m,v,g,h,p,b,w,y=this,M=new function(){var e,t,i=0;function n(){var a=1e3*i,o=1e3-((new Date).getTime()-e-a);t=setTimeout(n,Math.max(0,o)),i++,s()}function s(){var e=I(i),t=document.getElementById("seconds_hundreds"),n=document.getElementById("seconds_tens"),s=document.getElementById("seconds_ones");t&&n&&s&&(t.className="time"+e[0],n.className="time"+e[1],s.className="time"+e[2])}this.start=function(){t||(e=(new Date).getTime()-1e3*i,n())},this.stop=function(){clearTimeout(t),t=null},this.getTime=function(){return i},this.setTime=function(e){i=e,s()}},q=!1,C="";function R(){return void 0===n?"":n+"_"+s+"_"+a}function _(e,t){var i=0,a=!1,o=!1,r=!1;this.addToValue=function(e){i+=e},this.isMine=function(){return i<0},this.isFlagged=function(){return a},this.isMarked=function(){return o},this.isRevealed=function(){return r},this.isHidden=function(){return e<1||e>n||t<1||t>s},this.getRow=function(){return e},this.getCol=function(){return t},this.getValue=function(){return i},this.setRevealed=function(e){r=e},this.plantMine=function(){i-=10;for(var n=-1;n<=1;n++)for(var s=-1;s<=1;s++)0===n&&0===s||l[e+n]&&l[e+n][t+s]&&l[e+n][t+s].addToValue(1)},this.unplantMine=function(){i+=10;for(var n=-1;n<=1;n++)for(var s=-1;s<=1;s++)0===n&&0===s||l[e+n]&&l[e+n][t+s]&&l[e+n][t+s].addToValue(-1)},this.setClass=function(i){var n=document.getElementById(e+"_"+t);n&&(n.className=i)},this.reveal1=function(){var e,t,i,n=[],s=new Set;function a(e){s.add(e.getRow()+"_"+e.getCol())}for(n.push(this),a(this);n.length>0;)if(!(e=n.pop()).isRevealed()&&!e.isFlagged()){if(e.isMine())return!1;if(e.setClass("square open"+e.getValue()),e.setRevealed(!0),!e.isHidden()&&0==--u)return k(),!0;if(0===e.getValue()&&!e.isHidden())for(var o=-1;o<=1;o++)for(var r=-1;r<=1;r++)l[e.getRow()+o]&&l[e.getRow()+o][e.getCol()+r]&&(t=l[e.getRow()+o][e.getCol()+r],i=t,s.has(i.getRow()+"_"+i.getCol())||t.isHidden()||t.isRevealed()||(n.push(t),a(t)))}return T(),!0},this.reveal9=function(){if(r){for(var n,s=0,a=[],o=-1;o<=1;o++)for(var d=-1;d<=1;d++)0===o&&0===d||l[e+o]&&l[e+o][t+d]&&(n=l[e+o][t+d]).isFlagged()&&s++;if(s===i){for(o=-1;o<=1;o++)for(d=-1;d<=1;d++)0===o&&0===d||l[e+o]&&l[e+o][t+d]&&((n=l[e+o][t+d]).isFlagged()||n.isHidden()||n.reveal1()||a.push(n));a.length>0?B(a):T()}}},this.flag=function(e){if(!r){a?(this.setClass("square blank"),e&&this._showFlagAnimation(!0),a=!1,d++,E()):o?(this.setClass("square blank"),o=!1):(this.setClass("square bombflagged"),a=!0,d--,E(),e&&this._showFlagAnimation(!1)),T()}},this._showFlagAnimation=function(i){var n=$("#"+e+"_"+t);if(n.length){var s=n.offset(),a=s.left+n.width()/2,o=s.top+n.height()/2,r=138.25,d={left:a-49.875,top:o-69.125,width:"99.75px",height:r+"px",opacity:0},u={left:a,top:o,width:0,height:0,opacity:1};if(i){var l=d;d=u,u=l}var c=$('<img src="asset/flag.png" class="flag-animation"></div>').css(d);$("body").append(c),setTimeout((function(){c.css(u)}),0),setTimeout((function(){c.remove()}),500)}},this.serializeToObj=function(e){return e?r||a||o?[i,r?1:0,a?1:0,o?1:0]:i:{value:i,isRevealed:r,isFlagged:a,isMarked:o}},this.deserializeFromObj=function(e){i=e.value,a=e.isFlagged,o=e.isMarked,r=e.isRevealed}}function T(){var e=function(e){for(var t=[],i=0;i<=n+1;i++){t[i]=[];for(var a=0;a<=s+1;a++)t[i][a]=l[i][a].serializeToObj(e)}return t}(!1);o={gridObj:e}}function N(e){var t,i,a,o=e.getRow(),d=e.getCol(),u=[];if(!r){if(e.isMine()){var c=v[Math.floor(Math.random()*v.length)];if(c&&c!==e){c.plantMine(),e.unplantMine(),v.push(e);var f=v.indexOf(c);f>-1&&v.splice(f,1)}else v.length>0&&v[0]!==e&&(v[0].plantMine(),e.unplantMine(),v.push(e),v.splice(0,1))}u=[];for(var m=0;m<v.length;m++){var g=v[m];g.getRow()>=o-1&&g.getRow()<=o+1&&g.getCol()>=d-1&&g.getCol()<=d+1||u.push(g)}for(t=-1;t<=1;t++)for(i=-1;i<=1;i++)if(l[o+t]&&l[o+t][d+i]&&(a=l[o+t][d+i]).isMine()&&u.length>0){var h=u.splice(Math.floor(Math.random()*u.length),1)[0];h.plantMine(),a.unplantMine(),v.push(a);var p=v.indexOf(h);p>-1&&v.splice(p,1)}}return M.start(),1===o&&1===d||1===o&&d===s||o===n&&1===d||o===n&&d===s?1:1===o||o===n||1===d||d===s?2:3}function E(){var e=I(d),t=document.getElementById("mines_hundreds"),i=document.getElementById("mines_tens"),n=document.getElementById("mines_ones");t&&i&&n&&(t.className="time"+e[0],i.className="time"+e[1],n.className="time"+e[2])}function I(e){return(e=Math.min(e,999))>=0?[Math.floor(e/100),Math.floor(e%100/10),e%10]:["-",Math.floor(-e%100/10),-e%10]}function B(e){var t,i,a,o;for(document.getElementById("face")&&(document.getElementById("face").className="facedead"),M.stop(),f=!0,t=1;t<=n;t++)e:for(i=1;i<=s;i++)if(!(o=l[t][i]).isRevealed()){for(a=0;a<e.length;a++)if(o===e[a]){o.setClass("square bombdeath");continue e}o.isMine()&&!o.isFlagged()?o.setClass("square bombrevealed"):!o.isMine()&&o.isFlagged()&&o.setClass("square bombmisflagged")}}function k(){var e,t,a;for(document.getElementById("face")&&(document.getElementById("face").className="facewin"),M.stop(),f=!0,d=0,E(),e=1;e<=n;e++)for(t=1;t<=s;t++)(a=l[e][t]).isRevealed()||a.isFlagged()||a.setClass("square bombflagged");var o=M.getTime();y.onWin&&y.onWin(i,o)}function F(e){return!(!e||!e.className)&&"square"===e.className.substring(0,6)}function j(e){var t={};return t.left=0===e.button||1===e.button,t.right=2===e.button||1===e.button,t}function x(e,t,i){e&&!e.isRevealed()&&(e.isMarked()?e.setClass(i):e.isFlagged()||e.setClass(t))}function O(e,t,i){for(var n=-1;n<=1;n++)for(var s=-1;s<=1;s++)l[e.getRow()+n]&&l[e.getRow()+n][e.getCol()+s]&&x(l[e.getRow()+n][e.getCol()+s],t,i)}!function(){var e,t=!1;function i(t){if("touchmove"!==t.type||a(t)){var i=s(t);if(i!==e&&!g){var n="square open0",o="square questionpressed",r="square blank",d="square question";p?(e&&c[e.id]&&O(c[e.id],r,d),F(i)&&c[i.id]&&O(c[i.id],n,o)):(e&&c[e.id]&&x(c[e.id],r,d),F(i)&&c[i.id]&&x(c[i.id],n,o))}e=F(i)?i:void 0}}function n(e){if("touchmove"!==e.type||a(e)){var t=s(e),i=document.getElementById("face");i&&(i.className="face"===t.id?"facepressed":"facesmile")}}function s(e){if("touchmove"===e.type||"touchend"===e.type){var t=e.originalEvent.changedTouches[0];return document.elementFromPoint(t.clientX,t.clientY)}return e.target}function a(e){return null!==b&&e.originalEvent.changedTouches[0].identifier===b}function r(){if(null!==b){b=null;var t=document.getElementById("face");e&&c[e.id]&&(x(c[e.id],"square blank","square question"),e=void 0),!f&&t&&(t.className="facesmile")}}$(document).bind("gesturestart",(function(e){w=!0,r()})),$(document).bind("gestureend",(function(e){w=!1})),$(document).bind("scroll",r),$(document).bind("touchstart",(function(s){if($(document).unbind("mousedown").unbind("mouseup"),!b&&!w){b=s.originalEvent.changedTouches[0].identifier;var a=s.target,o=document.getElementById("face");if(F(a)&&!f){var r=b,d=a;setTimeout((function(){r===b&&d===e&&(c[d.id]&&c[d.id].flag(!0),b=null,!f&&o&&(o.className="facesmile"))}),500),$(document).bind("touchmove",i),o&&(o.className="faceooh"),e=void 0,i(s)}else"face"===a.id&&(t=!0,$(document).bind("touchmove",n),o&&(o.className="facepressed"))}})),$(document).bind("touchend",(function(e){if(a(e)){var o=b;b=null;var r=document.getElementById("face");$(document).unbind("touchmove",i).unbind("touchmove",n),!t&&f||!r||(r.className="facesmile");var d=s(e);if(F(d)&&!f&&null!==o){var u=c[d.id];if(!u)return;if(!m){N(u);m=!0}u.isRevealed()?u.reveal9():u.isFlagged()?u.flag(!0):u.reveal1()||B([u]),e.preventDefault()}else"face"===d.id&&t&&y.newGame();t=!1}})),$(document).mousedown((function(s){var a=j(s);h=a.left||h,p=a.right||p;var o=s.target,r=document.getElementById("face");s.ctrlKey&&F(o)&&!f?(c[o.id]&&c[o.id].flag(),q=!0):h?F(o)&&!f?(s.preventDefault(),$(document).bind("mousemove",i),r&&(r.className="faceooh"),e=void 0,i(s)):"face"===o.id&&(s.preventDefault(),t=!0,$(document).bind("mousemove",n),r&&(r.className="facepressed")):p&&F(o)&&!f&&c[o.id]&&c[o.id].flag()})),$(document).on("contextmenu",(function(e){var t=$(e.target);if(t.is("#game")||t.closest("#game").length>0)return e.preventDefault(),!1})),$(document).mouseup((function(e){var s,a=j(e),o=document.getElementById("face");if(q)return h=!1,p=!1,void(q=!1);if(a.left){if(h=!1,$(document).unbind("mousemove",i).unbind("mousemove",n),!t&&f||!o||(o.className="facesmile"),F(e.target)&&!f){if(!(s=c[e.target.id]))return;p?(g=!0,O(s,"square blank","square question"),s.reveal9()):g||(m||(N(s),m=!0),s.reveal1()||B([s])),g=!1}else"face"===e.target.id&&t&&y.newGame();t=!1}if(a.right){if(p=!1,F(e.target)&&!f){if(!(s=c[e.target.id]))return;h&&(g=!0,O(s,"square blank","square question"),s.reveal9()),g=!1}!f&&o&&(o.className="facesmile")}})),$(document).keydown((function(e){var t,i=document.getElementById("face");113===e.which?y.newGame():32===e.which?(C&&!f&&c[C]&&((t=c[C]).isRevealed()?t.reveal9():t.flag()),e.preventDefault()):90===e.which&&!e.shiftKey&&function(e){return window.navigator&&window.navigator.platform&&-1!==window.navigator.platform.toLowerCase().indexOf("mac")?e.metaKey:e.ctrlKey}(e)&&i&&"facedead"===i.className&&o&&y.newGame(o,{time:M.getTime()})})),$("#game").mouseover((function(e){F(e.target)&&(C=e.target.id)})),$("#game").mouseout((function(e){F(e.target)&&C===e.target.id&&(C="")}))}(),this.newGame=function(e,o){var y,N=t();y=R(),i=N.gameTypeId,n=N.numRows,s=N.numCols,a=N.numMines,1,o&&(void 0!==o.gameTypeId&&(i=o.gameTypeId),void 0!==o.numRows&&(n=o.numRows),void 0!==o.numCols&&(s=o.numCols),void 0!==o.numMines&&(a=o.numMines));var I,B=y!==R();I=1,$("#game-container, #game").width(I*(16*s+20)),$("#game").height(I*(16*n+30+26+6)),B&&function(){var e,t,i=[],a=function(){var e=1;return(e*s*16-6*Math.ceil(13*e)-2*e*6-26*e)/2}();for(i.push('<div class="bordertl"></div>'),t=0;t<s;t++)i.push('<div class="bordertb"></div>');for(i.push('<div class="bordertr"></div>'),i.push('<div class="borderlrlong"></div>'),i.push('<div class="time0" id="mines_hundreds"></div>'),i.push('<div class="time0" id="mines_tens"></div>'),i.push('<div class="time0" id="mines_ones"></div>'),i.push('<div class="facesmile" style="margin-left:',Math.floor(a),"px; margin-right:",Math.ceil(a),'px;" id="face"></div>'),i.push('<div class="time0" id="seconds_hundreds"></div>'),i.push('<div class="time0" id="seconds_tens"></div>'),i.push('<div class="time0" id="seconds_ones"></div>'),i.push('<div class="borderlrlong"></div>'),i.push('<div class="borderjointl"></div>'),t=0;t<s;t++)i.push('<div class="bordertb"></div>');for(i.push('<div class="borderjointr"></div>'),e=1;e<=n;e++){for(i.push('<div class="borderlr"></div>'),t=1;t<=s;t++)i.push('<div class="square blank" id="',e,"_",t,'"></div>');i.push('<div class="borderlr"></div>')}for(i.push('<div class="borderbl"></div>'),t=0;t<s;t++)i.push('<div class="bordertb"></div>');for(i.push('<div class="borderbr"></div>'),t=0;t<=s+1;t++)i.push('<div class="square blank" style="display: none;" id="',0,"_",t,'"></div>');for(t=0;t<=s+1;t++)i.push('<div class="square blank" style="display: none;" id="',n+1,"_",t,'"></div>');for(e=1;e<=n;e++)i.push('<div class="square blank" style="display: none;" id="',e,"_",0,'"></div>'),i.push('<div class="square blank" style="display: none;" id="',e,"_",s+1,'"></div>');$("#game").html(i.join(""))}(),function(e){var t,i,o,r;l=[],c={},v=[];var d=0;for(t=0;t<=n+1;t++)for(l[t]=[],i=0;i<=s+1;i++)r=new _(t,i),l[t][i]=r,c[t+"_"+i]=r,r.isHidden()||(v[d++]=r);if(e){var u=e.gridObj;for(t=0;t<=n+1;t++)for(i=0;i<=s+1;i++)l[t][i].deserializeFromObj(u[t][i]);for(v=[],t=0;t<=n+1;t++)for(i=0;i<=s+1;i++)(r=l[t][i]).isHidden()||r.isMine()||v.push(r)}else for(o=0;o<a&&v.length>0;o++){v.splice(Math.floor(Math.random()*v.length),1)[0].plantMine()}}(e),T(),r=!!e,d=a,u=n*s-a;for(var k=1;k<=n;k++)for(var F=1;F<=s;F++){var j=l[k][F];j.isFlagged()?(j.setClass("square bombflagged"),d--):j.isMarked()?j.setClass("square question"):j.isRevealed()?(j.setClass("square open"+j.getValue()),j.isHidden()||u--):j.setClass("square blank")}M.stop(),r?o&&void 0!==o.time&&M.setTime(o.time):M.setTime(0),E(),f=!1,m=!1,g=!1,h=!1,p=!1,b=null,w=!1,q=!1,document.getElementById("face")&&($("#face")[0].className="facesmile"),C=""},this.hasStartedPlaying=function(){return m}}

// === Code APPENDED from previous step ===
$(document).ready(function() {
    const defaultHighScores = [
        [999, 999, 999], [999, 999, 999], [999, 999, 999], [999, 999, 999]
    ];

    let AppSettings = {
        gameTypeId: 0,
        numRows: 9,
        numCols: 9,
        numMines: 10,
        isFillScreen: false
    };

    function getGameSettingsForMinesweeper() {
        return {
            gameTypeId: AppSettings.gameTypeId,
            numRows: AppSettings.numRows,
            numCols: AppSettings.numCols,
            numMines: AppSettings.numMines
        };
    }

    const minesweeper = new Minesweeper(defaultHighScores, getGameSettingsForMinesweeper);

    function calculateScreenFitSettings() {
        const h1Height = $('h1').outerHeight(true) || 0;
        const controlsHeight = $('.ui-controls').outerHeight(true) || 0;
        const bodyMarginTop = parseInt($('body').css('margin-top')) || 0;
        
        const gameFrameWidthOverhead = 20;
        const gameFrameHeightOverhead = 62; 
        const cellWidth = 16;
        const cellHeight = 16;

        let availableWidthForCells = window.innerWidth - gameFrameWidthOverhead;
        let availableHeightForCells = window.innerHeight - h1Height - controlsHeight - bodyMarginTop - gameFrameHeightOverhead;

        let cols = Math.floor(availableWidthForCells / cellWidth);
        let rows = Math.floor(availableHeightForCells / cellHeight);

        cols = Math.max(5, cols); 
        rows = Math.max(5, rows); 
        
        let mines = Math.floor(rows * cols * 0.16); 
        mines = Math.max(1, Math.min(mines, (rows * cols) - 1, 999)); 

        return { numRows: rows, numCols: cols, numMines: mines };
    }

    function applyCurrentSettingsAndStartNewGame() {
        if (AppSettings.isFillScreen) {
            const screenFit = calculateScreenFitSettings();
            AppSettings.numRows = screenFit.numRows;
            AppSettings.numCols = screenFit.numCols;
            AppSettings.numMines = screenFit.numMines;
        }

        minesweeper.newGame(null, {
            gameTypeId: AppSettings.gameTypeId,
            numRows: AppSettings.numRows,
            numCols: AppSettings.numCols,
            numMines: AppSettings.numMines
        });
    }

    applyCurrentSettingsAndStartNewGame();

    $('#newGameBtn').click(function(e) {
        e.preventDefault();
        applyCurrentSettingsAndStartNewGame();
    });

    $('.dialog-close').click(function() {
        $(this).closest('.dialog').hide();
    });

    $('#options-link').click(function(e) {
        e.preventDefault();
        populateSettingsDialog();
        $('#options-dialog').show();
    });

    function populateSettingsDialog() {
        if (AppSettings.isFillScreen) {
            const screenFit = calculateScreenFitSettings(); 
            $('#customRows').val(screenFit.numRows);
            $('#customCols').val(screenFit.numCols);
            $('#customMines').val(screenFit.numMines);
        } else {
            $('#customRows').val(AppSettings.numRows);
            $('#customCols').val(AppSettings.numCols);
            $('#customMines').val(AppSettings.numMines);
        }
        $('#fillToScreen').prop('checked', AppSettings.isFillScreen);
        toggleCustomInputDisabledState(AppSettings.isFillScreen);
    }

    function toggleCustomInputDisabledState(isFillScreen) {
        $('#customRows').prop('disabled', isFillScreen);
        $('#customCols').prop('disabled', isFillScreen);
        $('#customMines').prop('disabled', isFillScreen);
    }

    $('#fillToScreen').change(function() {
        AppSettings.isFillScreen = $(this).is(':checked');
        toggleCustomInputDisabledState(AppSettings.isFillScreen);
        if (AppSettings.isFillScreen) {
            const screenFit = calculateScreenFitSettings();
            $('#customRows').val(screenFit.numRows);
            $('#customCols').val(screenFit.numCols);
            $('#customMines').val(screenFit.numMines);
        }
    });

    $('#applySettingsNewGame').click(function() {
        AppSettings.isFillScreen = $('#fillToScreen').is(':checked');

        if (AppSettings.isFillScreen) {
            const screenFit = calculateScreenFitSettings();
            AppSettings.numRows = screenFit.numRows;
            AppSettings.numCols = screenFit.numCols;
            AppSettings.numMines = screenFit.numMines;
        } else {
            AppSettings.numRows = parseInt($('#customRows').val());
            AppSettings.numCols = parseInt($('#customCols').val());
            AppSettings.numMines = parseInt($('#customMines').val());

            if (isNaN(AppSettings.numRows) || AppSettings.numRows < 5 || AppSettings.numRows > 50 ||
                isNaN(AppSettings.numCols) || AppSettings.numCols < 5 || AppSettings.numCols > 50 ||
                isNaN(AppSettings.numMines) || AppSettings.numMines < 1 || AppSettings.numMines > 999) {
                alert("Invalid custom game settings. Rows/Cols (5-50), Mines (1-999).");
                return;
            }
            if (AppSettings.numMines >= AppSettings.numRows * AppSettings.numCols) {
                alert("Number of mines must be less than the total number of squares.");
                return;
            }
        }
        
        applyCurrentSettingsAndStartNewGame();
        $('#options-dialog').hide();
    });

    $('#toggleNightModeBtn').click(function(e) {
        e.preventDefault();
        $('body').toggleClass('night-mode');
        if ($('body').hasClass('night-mode')) {
            $(this).text('Toggle Light Mode');
        } else {
            $(this).text('Toggle Night Mode');
        }
    });

    minesweeper.onWin = function(gameTypeId, time) {
        setTimeout(function() {
            alert(`Congratulations! You won in ${time} seconds!`);
        }, 100);
    };
    
    minesweeper.onNewHighScore = function(level, isOfficialRecord) {
    };

    $('.dialog-title').on('mousedown', function(e) {
        var $dialog = $(this).closest('.dialog');
        if ($(e.target).is('.dialog-close')) {
            return;
        }
        var offset = $dialog.offset();
        var relX = e.pageX - offset.left;
        var relY = e.pageY - offset.top;

        $dialog.addClass('dragging');

        $(document).on('mousemove.dialogDrag', function(moveEvent) {
            $dialog.offset({
                top: Math.max(0, moveEvent.pageY - relY),
                left: Math.max(0, moveEvent.pageX - relX)
            });
        }).on('mouseup.dialogDrag', function() {
            $(document).off('.dialogDrag');
            $dialog.removeClass('dragging');
        });
        e.preventDefault();
    });
});