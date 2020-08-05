<?php
	// requires php5
	define('UPLOAD_DIR', 'images/');
	
	$img = $_POST['imgData'];
	$img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
	$filename = $_POST['fileNAME'];
	$file = UPLOAD_DIR . md5($filename) . '.png' ;
	$success = file_put_contents($file, $data);
	print $success ? $file : 'Unable to save the file.';
	
?>
