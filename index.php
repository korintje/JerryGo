<?php
if(isset($_GET['kf'])) { $kifu = $_GET['kf']; }
if(isset($_GET['rn'])) { $rownum = $_GET['rn']; }

$str  = '';
$str .= $kifu;
$str .= $rownum;
$filepath  = '';
$filepath .= 'https://korintje.com/html/jerrygo/images/';
$filepath .= md5($str);
$filepath .= '.png';
$url  = '';
$url .= 'https://korintje.com/html/jerrygo/index.php';
$url .= '?kf=';
$url .= $kifu;
$url .= '&';
$url .= 'rn=';
$url .= $rownum;
$lastcolor = substr($kifu, -3, 1);
if($lastcolor == "b") { $lastcolorj = "黒"; }
if($lastcolor == "w") { $lastcolorj = "白"; }
$lastx     = substr($kifu, -2, 1);
$lasty     = substr($kifu, -1, 1);
?>

<!DOCTYPE html>
<html lang="ja">
<head>
  <title>ゼリーの碁盤</title>
  <meta charset="UTF-8">
  <meta name="twitter:site"       content="https://korintje.com/html/jerrygo/index.php" />
  <meta name="twitter:card"       content="summary_large_image" />
  <meta name="description"        content="<?php echo $lastcolorj; ?>が<?php echo $lastx; ?>の<?php echo $lasty; ?>に打ちました。続きを打つには画像をクリック！！ / #1日1ツイートで囲碁ルールを説明したら何日で伝えられるか">
  <meta property="og:description" content="<?php echo $lastcolorj; ?>が<?php echo $lastx; ?>の<?php echo $lasty; ?>に打ちました。続きを打つには画像をクリック！！ / #1日1ツイートで囲碁ルールを説明したら何日で伝えられるか">
  <meta property="og:url"         content="<?php echo $url; ?>" id="url_path" />
  <meta property="og:image"       content="<?php echo $filepath; ?>" id="image_path" />
  <meta property="og:title"       content="ゼリーの碁盤: <?php echo $lastcolorj; ?>が<?php echo $lastx; ?>の<?php echo $lasty; ?>に打ちました。続きを打つには画像をクリック！！" />
  <meta property="og:site_name"   content="ゼリーの碁盤: <?php echo $lastcolorj; ?>が<?php echo $lastx; ?>の<?php echo $lasty; ?>に打ちました。続きを打つには画像をクリック！！" />

  <meta name="viewport" content="width=device-width,initial-scale=0.8,minimum-scale=0.8,maximum-scale=0.8,user-scalable=no">
  <meta name="format-detection" content="telephone=no">
  <link media="only screen and (max-device-width:767px)" href="./css/smart.css" type="text/css" rel="stylesheet" />
  <link media="screen and (min-device-width:768px)" href="./css/design.css" type="text/css" rel="stylesheet" />

  <script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.js" charset="UTF-8"></script>
  <script type="text/javascript" src="./js/migolb.js" charset="UTF-8"></script>
  <script type="text/javascript" src="./js/jsigosumple.js" charset="UTF-8"></script>

</head>

<!-- Body from Here -->
<body>
  <div class="primally_container">

    <!--

  -->

    <div class="title_container">
      <h1 class="ctitle">ゼリーの碁盤</h1>
    </div>

    <div class="canvas_container">
      <div>
        <div id="ldmsg" class="myldmsg">ロード中です</div>
        <canvas id="cv1" class="cv" width="463" height="463"></canvas>
      </div>
    </div>

    <div class="ban_act_container">
      <p>アゲハマ</p>
      <p id="bhama">黒 × 0個</p>
      <p id="whama">白 × 0個</p>
      <select id="rowsel" name="rownum" >
        <option value="6" selected>6路盤</option>
        <option value="9">9路盤</option>
        <option value="13">13路盤</option>
        <option value="19">19路盤</option>
      </select>
      <!-- <button id="rowbtn" type="hidden">変更</button> -->
    </div>

    <div class="stn_act_container">
      <p id="backbtn" class="msr_btn13" ontouchstart=""><a href="#">一手戻る</a></p>
      <p id="frwrdbtn" class="msr_btn13" ontouchstart=""><a href="#">一手進む</a></p>
    </div>

    <div class="stn_act_container">
      <p id="passbtn" class="msr_btn13" ontouchstart=""><a href="#">パス</a></p>
      <p id="clbtn" class="msr_btn13" ontouchstart=""><a href="#">碁盤を初期化</a></p>
    </div>

    <div class="twt_act_container">
      <p id="exprtbtn" class="msr_btn12" ontouchstart=""><a href="#">盤面をTwitterに貼る</a></p>
    </div>

    <div class="twt_act_container">
      <textarea id="copytext"></textarea>
      <p id="twt_arrow">←←← ツイートに貼れます</p>
    </div>

    <div class="note_container">
      <div class="notediv">
	      <b>使用にあたっての許可等は一切不要です。ご自由にお使いください。</b><br>
        この碁盤アプリのエンジンは<a href="https://github.com/mimami24i">mimami24i</a>氏によって開発されたものに<a href="https://korintje.com">korintje</a>が改変を加えたものです。
        オリジナルのエンジンは<a href="https://github.com/mimami24i/jsIGO">mimami24i/jsIGO</a>で公開されています。<br>
      </div>
    </div>

    <div class="note_container">
      <div class="notediv">
        更新情報: 「パス後にコウが取れない」「最後のパスが反映されない」を修正, Twitterカードのメッセージ変更(2020/05/30), 「Microsoft Edge(旧)」で表示エラーになる問題を修正（2020/05/30）.
      </div>
    </div>

    <div class="testarea">
    </div>

  </div>
