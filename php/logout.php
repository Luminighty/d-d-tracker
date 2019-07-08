<?php
	session_start();
	ob_start();
	unset($_SESSION["loggedIn"]);
	unset($_SESSION["md5username"]);
	//unset($_COOKIE['loggedIn']);
	//unset($_COOKIE['md5username']);
	$_COOKIE["loggedIn"] = "";
	$_COOKIE["md5username"] = "";
	setcookie("loggedIn", 0, time() + 60*60*24, "/d-d/");
	setcookie("md5username", "", time() + 60*60*24, "/d-d");
	//setcookie("md5username", false);
	header('Location: ../index.php');
	session_destroy ();
?>