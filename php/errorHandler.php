<?php
$GLOBALS["errors"] = array();
function myErrorHandler($errno, $errstr, $errfile, $errline) {
		if (!(error_reporting() & $errno)) {
			return false;
		}
		$error = "";
		switch ($errno) {
		case E_USER_ERROR:
			echo '
			
					<div style="user-select:all; display: block;;background-color: rgb(0, 0, 168); color: white; font-family:\'Courier New\', Courier, monospace">
					<span style="user-select: none;">
						A problem has been detected and the site has been shut down to prevent damage..<br><br>

						If this is the first time you\'ve seen this stop error screen, contact Luminight. If this screen appears again, follow these steps:<br><br>
						
						Check to make sure any new animes or mangas are avaliable. If this is a new isekai, ask your local anime reviewer/youtuber for any anti-trash products<br><br>
						If problems continue, disable or remove any lifeform nearby. Disable human society such as the USA or Russia. If you need to use traps to remove or disable humans, go on any hentai site, select ugly bastard tag, and then select your waifu.<br><br>
						
						Technical information:<br><br></span>
					<span>
					ERROR ['.$errno.']: '.$errstr.'<br><br>
					Fatal error on line '.$errline.' in file "'.$errfile.'"<br>
					PHP '. PHP_VERSION .' ('. PHP_OS .')</span><br>
					<span style="user-select: none;">Aborting...</span>
				</div>
			
			';
			die();
			return;
	
		case E_USER_WARNING:
			$error = '
				<div style="user-select:all;display: block;background-color: black; color: rgb(0, 255, 0); font-family:\'Courier New\', Courier, monospace; z-index: 500">
					<span style="color: red; font-weight: bold">(!)</span>
					<span>WARNING ['.$errno.']: '.$errstr.' on line '.$errline.' in "'.$errfile.'"</span>
				</div>
				';
			break;
	
		case E_USER_NOTICE:
			$error = '
				<div style="user-select:all;display: block;background-color: black; color: rgb(0, 255, 0); font-family:\'Courier New\', Courier, monospace; z-index: 500">
					<span style="color: red; font-weight: bold">(!)</span>
					<span>NOTICE ['.$errno.']: '.$errstr.' on line '.$errline.' in "'.$errfile.'"</span>
				</div>
				';
			break;
	
		default:
			$error = '
				<div style="user-select:all; display: block;background-color: black; color: rgb(0, 255, 0); font-family:\'Courier New\', Courier, monospace; z-index: 500">
					<span style="color: red; font-weight: bold">(!)</span>
					<span>UNKNOWN ERROR ['.$errno.']: '.$errstr.' on line '.$errline.' in "'.$errfile.'"</span>
				</div>
				';
			break;
		}
		array_push($GLOBALS["errors"], $error);
	}
	set_error_handler("myErrorHandler");
?>