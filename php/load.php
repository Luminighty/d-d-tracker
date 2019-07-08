<?php
$user = ($_GET["user"] != "false") ? $_GET["user"] : $_COOKIE["md5username"];
if(!$_GET['id'] || !$user) {
	echo $_GET["user"];
} else {
	echo file_get_contents("../data/".$user."/".$_GET['id'].".chr");
}


?>