<?php
ob_start();
$hibak = array();
if ($_POST) {
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    $password2 = $_POST['password2'];
    $users = fajlbol_betolt('../.htpasswd');
    if (strlen($username) == 0) {
        $hibak[] = 'Missing Username!';
    }
    if (strlen($password) == 0) {
        $hibak[] = 'Missing Password!';
	}
	if($password != $password2) {
        $hibak[] = "Passwords don't match!";
	}
    if (array_key_exists($username, $users)) {
        $hibak[] = 'Username already exists!';
    }
    if (!$hibak) {
		$users[$username] = md5($password);
		$_SESSION["loggedIn"] = true;
		$_SESSION["username"] = $username;
		fajlba_ment('../.htpasswd', $users);
		mkdir("../data/".md5($username), 0777, true);
		copy("../data/user.settings","../data/".md5($username)."/user.settings");
        header('Location: ../index.php');
        exit();
    }
}

function fajlbol_betolt($fajlnev) {
    $s = file_get_contents($fajlnev);
    return json_decode($s, true);
}

function fajlba_ment($fajlnev, $adat) {
    $s = json_encode($adat);
    return file_put_contents($fajlnev, $s, LOCK_EX);
}

?>

<!DOCTYPE html>
<html>
<head><title>Error - DnD</title></head>
<body>
    <h1>Errors</h1>
    <ul>
    <?php 
        foreach($hibak as $h)
            echo "<li>" . $h . "</li>";
    ?>
    </ul>
</body>
</html>