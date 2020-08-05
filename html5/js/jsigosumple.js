/**
 * @fileoverview JavaScript囲碁ライブラリmigolb.jsのサンプル。
 *  jquery1.4.4以降, migolb.js を前提とする。
 * @author mimami24im@gmail.com
 */

/**
 * @namespace
 */
var mijoseki = {};

(function($) {
/* 定数 */
mijoseki.con = {
  id: { // id名
    cv: 'cv1', // Canvas
    clbtn: 'clbtn', // クリアボタン
    passbtn: 'passbtn', // パスボタン
    backbtn: 'backbtn', // 戻るボタン
    frwrdbtn: 'frwrdbtn', // 戻るボタン
    exprtbtn: 'exprtbtn', //URLコピーボタン
    rowbtn: 'rowbtn', // 盤変更ボタン
    rowsel: 'rowsel', // 何路盤か指定select
    ldmsg: 'ldmsg'  // ロード中メッセージ表示div
  },
};

/* グローバル変数 */
mijoseki.translate = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u"];
mijoseki.gobansizes = ["6", "9", "13", "19"]
mijoseki.act = null; // アクションインスタンス

/**
 * アクションクラス
 * @param {HTMLElement} canvas 表示先HTMLCanvasElement
 * @param {number} cvx ブラウザ上のCanvas左上x座標
 * @param {number} cvy ブラウザ上のCanvas左上y座標
 * @private
 * @constructor
 */
mijoseki.Action_ = function(canvas, cvx, cvy) {
  /**
   * 碁盤クラスインスタンス
   * @type {migolib.Goban}
   */
  this.goban = new migolib.Goban(canvas);;
  this.goban.current_kifu  = [];
  this.goban.longest_kifu  = [];
  this.goban.current_bhama = 0;
  this.goban.current_whama = 0;
  this.goban.stone_sum_bf  = 0;
  this.goban.stone_sum_af  = 0;
  /**
   * ブラウザ上のCanvas左上x座標
   * 整数を設定することを推奨
   * @type {number}
   */
  this.cvx = cvx;
  /**
   * ブラウザ上のCanvas左上y座標
   * 整数を設定することを推奨
   * @type {number}
   */
  this.cvy = cvy;
  /**
   * 置く石の色。migolib.con.eyest の値をセット。
   * @type {string}
   * @private
   */
  this.sttype_ = migolib.con.eyest.b;
  /**
   * マウスポインタが指す目のX軸方向index。一番左の目が0
   * @type {number}
   */
  this.xidx = 0;
  /**
   * マウスポインタが指す目のY軸方向index。一番上の目が0
   * @type {number}
   */
  this.yidx = 0;
  /**
   * 前回描画時のxidx
   * @type {number}
   * @private
   */
  this.xidxbk_ = 0;
  /**
   * 前回描画時のyidx
   * @type {number}
   * @private
   */
  this.yidxbk_ = 0;
  /**
   * 描画フラグ。trueならdrawする。
   * @type {boolean}
   * @private
   */
  this.drawflg_ = false;
  /**
   * 1秒あたりのフレーム数
   * @type {number}
   * @private
   */
  this.fps_ = 12;
  /**
   * フレーム表示間隔(ミリ秒)
   * @type {number}
   */
  this.mspf = 1000 / this.fps_;;
  /**
   * タイマー用ID
   */
  this.timeoutID = null;

};
/**
 * 碁盤のサイズを変更して再表示
 * @param {number} rownum 何路盤か。5以上19以下の整数を設定
 */
mijoseki.Action_.prototype.chngsz = function(rownum) {
  this.goban.setrownum(rownum);
  this.sttype_ = migolib.con.eyest.b;
  this.goban.drawbanst();
};
/**
 * マウスポインタが指す目の情報を付加して描画
 */
mijoseki.Action_.prototype.draw = function() {
  // drawflgがfalseで、xidx, yidxに変化が無ければ描画しない
  if (!this.drawflg_ && this.xidx == this.xidxbk_ &&
      this.yidx == this.yidxbk_) {
    return;
  }
  this.goban.drawbanst();
  this.goban.drawTsStone(this.sttype_, this.xidx, this.yidx);
  this.xidxbk_ = this.xidx;
  this.yidxbk_ = this.yidx;
  this.drawflg_ = false;
};
/**
 * マウスポインタが指す目の情報と無関係に描画
 * @param {?boolean} clrflg 石をクリアする場合はtrue。
 */
mijoseki.Action_.prototype.drawAgain = function(clrflg) {
  if (clrflg === true) {
    this.sttype_ = migolib.con.eyest.b;
    this.goban.eyeinit();
  }
  this.goban.drawbanst();
};

/**
 * 石を手動で置く
 * @param {number} cx Canvas上X座標(px)
 * @param {number} cy Canvas上Y座標(px)
 */
mijoseki.Action_.prototype.putstone = function(cx, cy) {
  // 目のindex取得
  var eyeidx = this.goban.getEyeIdx(cx, cy);
  this.xidx = eyeidx[0];
  this.yidx = eyeidx[1];
  // 石を置く
  var rtn = this.goban.putstone(this.sttype_, eyeidx[0], eyeidx[1]);

  if (Array.isArray(rtn) === true) {
    this.drawflg_ = true;
    if (this.sttype_ == migolib.con.eyest.b) {
      this.sttype_ = migolib.con.eyest.w;
      tquery = "b";
    } else if (this.sttype_ == migolib.con.eyest.w)  {
      this.sttype_ = migolib.con.eyest.b;
      tquery = "w";
    }
    vquery = mijoseki.translate[this.xidx];
    hquery = mijoseki.translate[this.yidx];
    move = tquery + vquery + hquery
    this.goban.current_kifu.push(move);
    this.goban.longest_kifu = this.goban.current_kifu.slice();

    this.goban.current_bhama = total_count_bw(this.goban.current_kifu)[0] - rtn[0]
    this.goban.current_whama = total_count_bw(this.goban.current_kifu)[1] - rtn[1]
    let bhama_show = document.getElementById('bhama')
    let whama_show = document.getElementById('whama')
    bhama_show.innerHTML = "黒 × " + this.goban.current_bhama + "個"
    whama_show.innerHTML = "白 × " + this.goban.current_whama + "個"
    let textarea = document.getElementById("copytext");
    textarea.value = "";
  } else if (rtn != migolib.con.msg.sthere) {
    window.alert('そこには石を置けません');
  }
};

/**
 * 棋譜をロード
 */
mijoseki.Action_.prototype.load_kifu = function(kifu) {
  let final_rtn = []
  //初期値は黒
  this.sttype_ = migolib.con.eyest.b;

  kifu.forEach(move => {
    //黒白パス判定
    st = move.slice(0, 1);
    if (st === "0"){
      mijoseki.act.pass();
    }else{
      if (st === "b"){
        this.sttype_ = migolib.con.eyest.b;
      }
      if (st === "w"){
        this.sttype_ = migolib.con.eyest.w;
      }
      //石を置く
      this.xidx = mijoseki.translate.indexOf(move.slice(1, 2));
  	  this.yidx = mijoseki.translate.indexOf(move.slice(2, 3));
  	  var rtn = this.goban.putstone(this.sttype_, this.xidx, this.yidx);
      final_rtn = rtn;
      //console.log("stoned. current_move = " + this.goban.movenum);
    }
    //色反転操作
    if (this.sttype_ === migolib.con.eyest.b){
      this.sttype_ = migolib.con.eyest.w;
    } else if (this.sttype_ === migolib.con.eyest.w){
      this.sttype_ = migolib.con.eyest.b;
    }
  });
  //console.log("Longest after Each: " + mijoseki.act.goban.longest_kifu)
  this.drawflg_ = true;
  mijoseki.act.drawAgain(false);

  //棋譜を設定
  this.goban.current_kifu  = kifu

  //ハマの計算
  this.goban.current_bhama = total_count_bw(this.goban.current_kifu)[0] - final_rtn[0]
  this.goban.current_whama = total_count_bw(this.goban.current_kifu)[1] - final_rtn[1]
  let bhama_show = document.getElementById('bhama')
  let whama_show = document.getElementById('whama')
  bhama_show.innerHTML = "黒 × " + this.goban.current_bhama + "個"
  whama_show.innerHTML = "白 × " + this.goban.current_whama + "個"
  let textarea = document.getElementById("copytext");
  textarea.value = "";
};

/**
 * パスする
 */
mijoseki.Action_.prototype.pass = function() {
  this.goban.movenum++;
  //console.log("pased. current_move = " + this.goban.movenum)
  this.goban.lsmove = null;
  if (this.sttype_ === migolib.con.eyest.b){
    this.sttype_ = migolib.con.eyest.w;
  }else{
    this.sttype_ = migolib.con.eyest.b;
  }
};


/**
 * Canvasにイベント付与
 * @private
 */
mijoseki.bindEvt_ = function() {
  var $cv = $('#' + mijoseki.con.id.cv);
  $cv.mousedown(mijoseki.cvmsDown_);
  $cv.mousemove(mijoseki.cvmsMove_);
  $cv.mouseenter(mijoseki.cvmsEnter_);
  $cv.mouseleave(mijoseki.cvmsLv_);
};

/**
 * Canvasからイベント削除
 * @private
 */
mijoseki.unbindEvt_ = function() {
  var $cv = $('#' + mijoseki.con.id.cv);
  $cv.unbind('mousedown', mijoseki.cvmsDown_);
  $cv.unbind('mousemove', mijoseki.cvmsMove_);
  $cv.unbind('mouseenter', mijoseki.cvmsEnter_);
  $cv.unbind('mouseleave', mijoseki.cvmsLv_);
};

/**
 * Canvasでmousedown時に行われる処理
 * @private
 */
mijoseki.cvmsDown_ = function(evt) {
  // ポインタ座標をCanvas座標へ変換
  var cx = ~~(evt.pageX - mijoseki.act.cvx);
  var cy = ~~(evt.pageY - mijoseki.act.cvy);
  // 石を置く
  mijoseki.act.putstone(cx, cy);
};
/**
 * Canvasでmousemove時に行われる処理
 * @private
 */
mijoseki.cvmsMove_ = function(evt) {
  // ポインタ座標をCanvas座標へ変換
  var cx = ~~(evt.pageX - mijoseki.act.cvx);
  var cy = ~~(evt.pageY - mijoseki.act.cvy);
  // 目のindex取得
  var eyeidx = mijoseki.act.goban.getEyeIdx(cx, cy);
  mijoseki.act.xidx = eyeidx[0];
  mijoseki.act.yidx = eyeidx[1];
};
/**
 * Canvasでmouseenter時に行われる処理
 * @private
 */
mijoseki.cvmsEnter_ = function() {
  // メインループ開始
  if (!mijoseki.act.timeoutID) {
    mijoseki.act.timeoutID = window.setInterval(function() {
          mijoseki.act.draw();
        }, mijoseki.act.mspf);
  }
};
/**
 * Canvasでmouseleave時に行われる処理
 * @private
 */
mijoseki.cvmsLv_ = function() {
  // メインループ停止
  if (mijoseki.act.timeoutID) {
    window.clearInterval(mijoseki.act.timeoutID);
    mijoseki.act.timeoutID = null;
  }
  // 再描画
  mijoseki.act.drawAgain(false);
};

/**
 * 碁盤のサイズを変更する
 * @private
 */
mijoseki.banchg_ = function() {
  var banrow =  parseInt($('#' + mijoseki.con.id.rowsel +
    ' option:selected').val(), 10);
  mijoseki.act.chngsz(banrow);
  mijoseki.act.goban.current_bhama = 0
  mijoseki.act.goban.current_whama = 0
  mijoseki.act.goban.current_kifu = []
  let bhama_show = document.getElementById('bhama')
  let whama_show = document.getElementById('whama')
  bhama_show.innerHTML = "黒 × 0個"
  whama_show.innerHTML = "白 × 0個"
  let textarea = document.getElementById("copytext");
  textarea.value = "";
};

/**
 * 一手戻る
 * @private
 */
mijoseki.back_ = function(){
  mijoseki.act.drawAgain(true);
  console.log("longest:" + mijoseki.act.goban.longest_kifu)
  console.log("current:" + mijoseki.act.goban.current_kifu)
  mijoseki.act.load_kifu(mijoseki.act.goban.current_kifu.slice(0, -1))
};

/**
 * 一手進む
 * @private
 */
mijoseki.forward_ = function(){
  mijoseki.act.drawAgain(true);
  let new_kifu = []
  console.log("longest:" + mijoseki.act.goban.longest_kifu);
  console.log("current:" + mijoseki.act.goban.current_kifu);
  try{
    new_kifu = mijoseki.act.goban.longest_kifu.slice(0, mijoseki.act.goban.current_kifu.length + 1);
    mijoseki.act.load_kifu(new_kifu);
  }catch(e){
    new_kifu = mijoseki.act.goban.current_kifu.slice();
    console.log("failed to get longest");
  }
};

/**
 * パスする
 * @private
 */
mijoseki.pass_ = function() {
  mijoseki.act.pass();
  move = "000"
  mijoseki.act.goban.current_kifu.push(move);
  mijoseki.act.goban.longest_kifu = mijoseki.act.goban.current_kifu.slice();
};

/**
 * 碁盤をクリアする
 * @private
 */
mijoseki.banclear_ = function() {
  //this.sttype_ = migolib.con.eyest.b;
  mijoseki.act.drawAgain(true);
  mijoseki.act.goban.current_bhama = 0
  mijoseki.act.goban.current_whama = 0
  mijoseki.act.goban.current_kifu = []
  let bhama_show = document.getElementById('bhama')
  let whama_show = document.getElementById('whama')
  bhama_show.innerHTML = "黒 × 0個"
  whama_show.innerHTML = "白 × 0個"
  let textarea = document.getElementById("copytext");
  textarea.value = "";
  let banrow =  parseInt($('#' + mijoseki.con.id.rowsel + ' option:selected').val(), 10);
  window.location.href = 'https://korintje.com/html/jerrygo/index.php' + "?rn=" + String(banrow);
};


/**
 * 最初から
 * @private
 */
mijoseki.fromfirst_ = function(){
  mijoseki.act.drawAgain(true);
  mijoseki.act.load_kifu([])
  //mijoseki.act.sttype_ = migolib.con.eyest.b;
};

/**
 * 更新・出力をする
 * @private
 */
mijoseki.update_export_ = function() {
  //mijoseki.act.update_url_()
  //mijoseki.act.export_url_()
}

/**
 * URLを更新する
 * @private
 */
mijoseki.update_url_ = function() {
  url_base = "https://korintje.com/html/jerrygo/index.php?"
  url_kf = "kf=" + mijoseki.act.goban.current_kifu.join("");
  url_rn = "rn=" + parseInt($('#' + mijoseki.con.id.rowsel + ' option:selected').val(), 10);
  let copyText = url_base + url_kf + "&" + url_rn
  window.location.href = copyText;
}

/**
 * URLを出力する
 * @private
 */
mijoseki.export_url_ = function() {
  var canvas = document.getElementById("cv1");
  //create a dummy CANVAS
  destinationCanvas = document.createElement("canvas");
  destinationCanvas.width = canvas.width*2;
  destinationCanvas.height = canvas.height;
  destCtx = destinationCanvas.getContext('2d');
  destCtx.fillStyle = "#F0F0E0";
  destCtx.fillRect(0,0,canvas.width*2,canvas.height);
  destCtx.fillStyle = "#808080";
  destCtx.rect(0,0,canvas.width*2,canvas.height);
  destCtx.drawImage(canvas, canvas.width/2, 0);

  var dataURL = destinationCanvas.toDataURL("image/png");
  var hashNAME = document.getElementById("image_path").content.split("/").slice(-1)[0];
  str_kf = mijoseki.act.goban.current_kifu.join("");
  url_kf = "kf=" + str_kf
  str_rn = parseInt($('#' + mijoseki.con.id.rowsel + ' option:selected').val(), 10);
  url_rn = "rn=" + str_rn
  let nonhashNAME = str_kf + str_rn;
  console.log("hashNAME");
  console.log(hashNAME);
  var xmlHttpReq = false;
  if (window.XMLHttpRequest) {
    ajax = new XMLHttpRequest();
  }
  else if (window.ActiveXObject) {
    ajax = new ActiveXObject("Microsoft.XMLHTTP");
  }
  ajax.open("POST", "script.php", false);
  ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  ajax.onreadystatechange = function() {
    let svd_url = ajax.responseText
    console.log(svd_url);
  }
  ajax.send("imgData=" + dataURL + "&" + "fileNAME=" + nonhashNAME);

  url_base = "https://korintje.com/html/jerrygo/index.php?"
  let url_str  = url_base + url_kf + "&" + url_rn
  let url_area = document.getElementById("copytext");
  url_area.value = url_str;
  clipCopy("copytext")
  splash("コピー完了");
};

$(window).on("load", function() {
  // HTMLCanvasElementを取得
  var canvas = document.getElementById(mijoseki.con.id.cv);
  if ( ! canvas || ! canvas.getContext ) {
   return false;
  }

  // アクションインスタンス作成
  var cvoffset = $('#' + mijoseki.con.id.cv).offset();
  mijoseki.act = new mijoseki.Action_(canvas, cvoffset.left, cvoffset.top);
  let load_rn = getParam('rn')
  if (mijoseki.gobansizes.indexOf(load_rn) >= 0){
    mijoseki.act.chngsz(load_rn);
  }else{
    mijoseki.act.chngsz(6);
  }

  // クエリロード

  //console.log(mijoseki.act.goban.current_kifu)
  let kifu = splitByLength(getParam('kf'), 3)
  if (kifu.length !== 0){
    mijoseki.act.goban.current_kifu = kifu
    mijoseki.act.goban.longest_kifu = kifu
    //console.log("Loaded Longest: " + mijoseki.act.goban.longest_kifu)
    mijoseki.act.load_kifu(mijoseki.act.goban.current_kifu)
    //console.log("Loaded Longest: " + mijoseki.act.goban.longest_kifu)
  }
  let rownum = getParam('rn')
  let rowselector = document.getElementById('rowsel');
  if (rownum !== null) {
    //console.log("Row-Number: " + String(rownum));
    rowselector.value = String(rownum);
  }else{
    rowselector.value = "6";
  }

  // ロード中メッセージ削除
  $('#' + mijoseki.con.id.ldmsg).remove();


  // メインループ開始
  mijoseki.cvmsEnter_();

  // イベント付与
  mijoseki.bindEvt_();
  $('#' + mijoseki.con.id.clbtn).click(mijoseki.fromfirst_);
  //$('#' + mijoseki.con.id.rowbtn).click(mijoseki.banchg_);
  $('#' + mijoseki.con.id.rowsel).change(mijoseki.banchg_);
  $('#' + mijoseki.con.id.passbtn).click(mijoseki.pass_);
  $('#' + mijoseki.con.id.backbtn).click(mijoseki.back_);
  $('#' + mijoseki.con.id.frwrdbtn).click(mijoseki.forward_);
  $('#' + mijoseki.con.id.exprtbtn).click(mijoseki.export_url_);

  if (window.matchMedia('(max-width: 767px)').matches) {
      //スマホ処理
      console.log("SP mode")
      //let width_sp = window.screen.width
      //let canvas_sp = document.getElementById("cv1")
      //canvas_sp.width = width_sp - 6;
  } else if (window.matchMedia('(min-width:768px)').matches) {
      //PC処理
      console.log("PC mode")
  }

});

})(jQuery);

 /**
  * Get the URL parameter value
  *
  * @param  name {string} パラメータのキー文字列
  * @return  url {url} 対象のURL文字列（任意）
  */
 function getParam(name, url) {
     if (!url) url = window.location.href;
     name = name.replace(/[\[\]]/g, "\\$&");
     var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
         results = regex.exec(url);
     if (!results) return null;
     if (!results[2]) return '';
     return decodeURIComponent(results[2].replace(/\+/g, " "));
 }

 function splitByLength(str, length) {
    var resultArr = [];
    if (!str || !length || length < 1) {
        return resultArr;
    }
    var index = 0;
    var start = index;
    var end = start + length;
    while (start < str.length) {
        resultArr[index] = str.substring(start, end);
        index++;
        start = end;
        end = start + length;
    }
    return resultArr;
  }

  function total_count_bw(kifu) {
    let bwe_map = Array.prototype.concat.apply([], kifu).map(x => x.slice(0, 1));
    let countB = bwe_map.reduce((prev, item) => {
      return prev + (item === "b" ? 1 : 0)
    }, 0)
    let countW = bwe_map.reduce((prev, item) => {
      return prev + (item === "w" ? 1 : 0)
    }, 0)
    return [countB, countW];
  }

  function splash(msg, custom_set){

    //Default
    var set = {
        message_class: 'splashmsg default',
        fadein_sec: 0.1,
        wait_sec: 0.5,
        fadeout_sec: 1.5,
        opacity: 0.9,
        trans_in: 'ease-in',
        trans_out: 'ease-out',
        outer_style: 'top: 0px;left: 0px;position: fixed;z-index: 1000;width: 100%;height: 100%;',
        message_style: 'padding:0.5em;font-size:4em;color:white;background-color:gray; position: absolute;top: 50%; left: 50%;transform: translateY(-50%) translateX(-50%);-webkit-transform: translateY(-50%) translateX(-50%);',
        style_id: 'append_splash_msg_style',
        outer_id: 'append_splash_msg',
        message_id: 'append_splash_msg_inner',
        on_splash_vanished: null //callback function
    };

    //Override custom_set
    for (var key in custom_set) {
        if (custom_set.hasOwnProperty(key)) {
            set[key] = custom_set[key];
        }
    }

    //Style
    if(!document.getElementById(set.style_id)){
        var style = document.createElement('style');
        style.id = set.style_id;
        style.innerHTML =
            "#"+set.outer_id+" { "+set.outer_style+" } " +
            "#"+set.outer_id+" > #"+set.message_id+" {opacity: 0;transition: opacity "+set.fadeout_sec+"s "+set.trans_out+";-webkit-transition: opacity "+set.fadeout_sec+"s "+set.trans_out+";} " +
            "#"+set.outer_id+".show > #"+set.message_id+" {opacity: "+set.opacity+";transition: opacity "+set.fadein_sec+"s "+set.trans_in+";-webkit-transition: opacity "+set.fadein_sec+"s "+set.trans_in+";}" +
            "#"+set.message_id+" { "+set.message_style+" } ";
        document.body.appendChild(style);
    }

    //Element (Outer, Inner)
    if((e = document.getElementById(set.outer_id))) {e.parentNode.removeChild(e);if(set.on_splash_vanished) set.on_splash_vanished();}
    var splash = document.createElement('div');
    splash.id = set.outer_id;
    splash.onclick = function(){
        if((e = document.getElementById(set.outer_id))) e.parentNode.removeChild(e);
        if(set.on_splash_vanished) set.on_splash_vanished();
    };
    splash.innerHTML = '<div id="'+set.message_id+'" class="'+set.message_class+'">'+msg+'</div>';
    document.body.appendChild(splash);

    //Timer
    setTimeout(function(){if(splash) splash.classList.add('show');},0);
    setTimeout(function(){if(splash) splash.classList.remove('show');},set.wait_sec*1000);
    setTimeout(function(){if(splash && splash.parentNode) splash.parentNode.removeChild(splash);if(set.on_splash_vanished) set.on_splash_vanished();},(set.fadeout_sec+set.wait_sec)*1000);

  }

  function supercopy(id) {
    var copyText = document.getElementById(id);
    var ua = navigator.userAgent;
    if (ua.match(/iphone|ipod|ipad|android/i)) {
        var range = document.createRange();
        range.selectNode(copyText);
        window.getSelection().addRange(range);
    }
    else {
        try {
            copyText.select(); // input field
        } catch (error) {
            document.getSelection().selectAllChildren(copyText);
        }
    }
    var result = document.execCommand("copy");
    return result
  }

  function clipCopy(id) {
    // コピー対象の要素を取得
    var copytext = document.getElementById(id);
    // 使用端末を区別し、iOSとandroidで処理を分ける。
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        // iphone用のコピー設定
        try {
            // iOSの場合、readOnlyではコピーできない(たぶん)ので、
            // readOnlyを外す
            copytext.readOnly = false;
            // ここから下が、iOS用でしか機能しない関数------
            var range = document.createRange();
            range.selectNode(copytext);
            window.getSelection().addRange(range);
            // ------------------------------------------
            document.execCommand("copy");
            // readOnlyに戻す
            copytext.readOnly = true;
            //alert("URLをコピーしました。");
        } catch (e) {
            // エラーになった場合も、readOnlyに戻す
            copytext.readOnly = true;
            //alert("このブラウザでは対応していません。");
        }
    } else {
        // iphone以外のコピー設定
        try {
            copytext.select();
            document.execCommand('copy');
            copytext.readOnly = true;
            //alert("URLをコピーしました。");
        } catch (e) {
            //alert("このブラウザでは対応していません。");
        }
    }
  };
