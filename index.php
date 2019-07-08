<?php
	session_start();

	include "php/errorHandler.php";

	function fajlbol_betolt($fajlnev) {
		$s = file_get_contents($fajlnev);
		return json_decode($s, true);
	}

	function fajlba_ment($fajlnev, $adat) {
		$s = json_encode($adat);
		return file_put_contents($fajlnev, $s, LOCK_EX);
	}
	$loggedIn = $_SESSION['loggedIn'] || $_COOKIE["loggedIn"];
	$errors = array("");
	$GLOBALS["LOG"] = array();

	function ConsoleLog($text) {
		array_push($GLOBALS["LOG"], $text);
	}
	
	function var_dump_ret($mixed = null) {
		ob_start();
		var_dump($mixed);
		$content = ob_get_contents();
		ob_end_clean();
		return $content;
	}

	define("TOKEN", "Can use different files");
	$error;
	$user;
	if($_POST) {

		$username = trim($_POST['username']);
		$password = $_POST['password'];
		$users = fajlbol_betolt('.htpasswd');
		if (!array_key_exists($username, $users)) {
			$error = 'Username does not exists!';
		} else if($users[$username] != md5($password)) {
			$error = 'Username and password does not match!';
		} else {
			$user = $username;
			$mdUser = md5($username);
			$_SESSION["loggedIn"] = true;
			$_SESSION['md5username'] = $mdUser;
			setcookie("md5username", $mdUser, time() + 60*60*24*7, "/d-d");
			setcookie("loggedIn", true, time() + 60*60*24*7);
			$loggedIn = true;
		}
		if($loggedIn) {
			header("Refresh:0");
		return;
		}
	}
	if($loggedIn) {
		$users = array_keys(fajlbol_betolt('.htpasswd'));
		$username = $_COOKIE["md5username"];
		if(!$username)
			$username = $_SESSION['md5username'];
		foreach($users as $u)
			if($username == md5($u))
				$user = $u;
		setcookie("md5username", $username, time() + 60*60*24*7, "/d-d");
		setcookie("loggedIn", true, time() + 60*60*24*7);
		$chars = array_diff(scandir("data/".$username."/"), array('..', '.', "user.settings"));
		$settings = fajlbol_betolt("data/".$username."/user.settings");
		//var_dump($settings);

		$isDm = $settings["isDm"];
		$lastUpdate = $settings["lastUpdate"];
		if(!isset($lastUpdate))
			$lastUpdate = -1;
	}
?>

<?php if (!$loggedIn) : ?>
<!DOCTYPE html>
<html>
	<head>
		<script src="scripts/checkLocked.js"></script>
		<meta charset="utf-8">
		<link rel="canonical" href="https://…"/>
		<link rel="stylesheet" href="css/login.css" type="text/css">
		<title>D&amp;D - Login</title>
	</head>
	<body>
		<div class="holder" id="login">
			<h2>Welcome back!</h2>
			<p><?php 
			$welcomes = array("pls marry me ༼ つ ◕_◕ ༽つ",
							"(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
							"Okaeri!", 
							"Been thinking 'bout ya.", 
							"It's about time.", 
							"It's not like I want you to login or anything... Baka!",
							"Glad to have you back.",
							"I've been waiting for your return, mate.",
							"George, Don't forget to add a welcome message here!",
							"*horse noises*",
							"Howarya?",
							"Ready to work!",
							"The cake is a lie.",
							"Welcome back, cupcake! 20 pushups NOW!",
							"Notice me... senpai~!",
							"OwO",
							"https://tinyurl.com/2fcpre6",
							"It's so good to see you again!",
							"( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)",
							"Because games matter.",
							"Don't forget to like and subscribe.",
							"3:13",
							"69",
							"Happy birthday!",
							"Yesn't"
						);
			
			echo $welcomes[mt_rand(0, (count($welcomes) - 1))]; ?></p>
			<form method="POST" action="index.php">
				<label for="loginUser">Username</label>
				<input id="loginUser" type="text" name="username">
				<label for="loginPassword">Password</label>
				<input id="loginPassword" type="password" name="password">
				<button type="submit">Login</button>
				<?php 
				if($error)
					echo '<p style="color:#ff1a00; font-weight: normal; font-size: 0.9em">'.$error.'</p>'
				?>
			</form>
			<div class="footer">Don't have an account? <a id="toRegister" href="#">Register</a></div>
		</div>
		<div class="holder" id="register" style="display: none;">
			<h2>Create an account</h2>
			<p><?php 
			$welcomes = array("Hai~",
							"＼(^ω^＼)",
							"(・・；)",
							"｡(✿‿✿)｡",
							"ʕ•ᴥ•ʔ",
							"Kimi no Na wa", 
							"欠を食べる", 
							"Please make sure you don't make any typo.",
							"Just fill in the form, senpai.",
							"(This is might or might not the application for the axis cult)",
							"The cake is a lie.",
							"Roll 20!",
							"lumi is a nice person. i trust him.",
							"OwO",
							"Cave Johnson, we're done here!",
							"It's so good to see you again!",
							"*GAAAASP*",
							"Welcome to ponyville!",
							"ಠ_ಠ"
						);
			
			echo $welcomes[mt_rand(0, (count($welcomes) - 1))]; ?></p>
			<form method="POST" action="php/register.php">
				<label for="username">Username</label>
				<input id="username" type="text" name="username">
				<label for="password">Password</label>
				<input id="password" type="password" name="password">
				<label for="password2">Password Again</label>
				<input id="password2" type="password" name="password2">
				<button type="submit">Register</button>
			</form>
			<div class="footer">Already have an account? <a id="toLogin" href="#">Login</a></div>
		</div>
	</body>
	<script type="text/javascript" src="scripts/login.js"></script>
</html>

<?php else : ?>

<!DOCTYPE html>
<html style="background-image: url('<?php echo "media/index_bg".mt_rand(1,5).".jpg"; ?>')">
	<head>
		<script src="scripts/checkLocked.js"></script>
		<link rel="canonical" href="https://…"/>
		<link rel="stylesheet" href="css/user.css" type="text/css">
		<link rel="stylesheet" href="css/modal.css" type="text/css">
		<link rel="stylesheet" href="css/scrollbar.css" type="text/css">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<?php if($isDm) : ?>
		<link rel="stylesheet" href="css/dmScreen.css" type="text/css">
		<link rel="stylesheet" href="css/draggableList.css" type="text/css">
		<?php endif ?>
		<title>D&amp;D - <?php echo $user; ?></title>
	</head>
	<body>
		
		<div class="sidenav">
			<h1>Welcome back, <?php echo $user; ?></h1>
			<a id="Menu_charSelect" <?php if($_COOKIE["selected"] == "charSelect" || !$_COOKIE["selected"]) echo 'class="active"'; ?> href="#">Character Selection</a>
			<a id="Menu_QuestBoard" <?php if($_COOKIE["selected"] == "QuestBoard") echo 'class="active"'; ?> href="#">Quest Board</a>
			<a id="Menu_npcs" <?php if($_COOKIE["selected"] == "npcs") echo 'class="active"'; ?> href="#">NPCs</a>
			<a id="Menu_axel" <?php if($_COOKIE["selected"] == "axel") echo 'class="active"'; ?> href="#">Axel Map</a>
			<a id="Menu_rep" <?php if($_COOKIE["selected"] == "rep") echo 'class="active"'; ?> href="#">Reputation</a>
			<?php if($isDm): ?>
			<a id="Menu_dmScreen" <?php if($_COOKIE["selected"] == "dmScreen") echo 'class="active"'; ?> href="#">Dungeon Master Screen</a>
			<?php endif ?>
			<a href="https://www.wizards.com/d20modern/d20mdice/dice.htm" target="_blank">Dice Roller</a>
			<a href="https://roll20.net/compendium/dnd5e/Spells%20List#content" target="_blank">5e Spell List</a>
			<a href="#" id="modalOpen_updates">News</a>
			<a href="php/logout.php" class="bottom">Logout</a>
		</div>

		
		<div class="modal" id="questModal">
			<div class="modal-content">
			<div class="modal-header">
				<span id="questClose" class="modal_Close">&times;</span>
				<h2>Create Quest</h2>
			</div>
			<form class="questForm">
			<div class="modal-body">
				<table>
					<tr>
					<td><label for="questTitle">Title</label></td>
					<td><input id="questTitle" type="text"></td>
					</tr>
					<tr>
					<td><label for="questDescription">Description <span id="descriptionLength">(0/500)</label></td>
					<td></td>
					</tr>
					<tr>
					<td colspan="2"><textarea id="questDescription"></textarea></td>
					</tr>
					<tr>
					<td><label for="questComplete">Completed</label></td>
					<td><input id="questComplete" type="checkbox"></td>
					</tr>
				</table>
			</div>
			<div class="modal-footer">
				<div class="buttonHolder">
					<button class="questOK" type="button">Create</button>
					<button class="questCancel" type="reset">Cancel</button>
				</div>
			</div>
			</form>
			</div>
		</div>

		
		<div class="modal" id="updatesModal" 
			<?php 
				$updates = fajlbol_betolt("Updates");
				if($updates["id"] > $lastUpdate) {
					echo 'style="display: block;"';
					$settings["lastUpdate"] = $updates["id"];
					fajlba_ment("data/".$username."/user.settings", $settings);
				}
			
			?>>
			<div class="modal-content">
			<div class="modal-header">
				<span id="updatesClose" class="modal_Close">&times;</span>
				<h2>Recent Updates</h2>
			</div>
			<div class="modal-body">
			<?php

				foreach($updates["updates"] as $update) {
					echo '<h3 style="text-align: left;">'.$update['title'].'</h3>';
					echo '<div>'.$update['description'].'<div class="updateDate">'.$update['date'].'</div></div><hr>';
				}

			?>

			</div>
			<div class="modal-footer">
			</div>
			</div>
		</div>


		<div class="content" id="charSelect" <?php if($_COOKIE["selected"] != "charSelect" && $_COOKIE["selected"]) echo 'style="display: none;"'; ?>   >
			<h2>Character Selection</h2>
			<div class="CharacterButton">
				<table>
					<tr hidden class="Hover Clickable CharElement">
						<td class='image'><img src=''></td>
						<td class='Name'></td>
						<td class='Buttons'><button class='removeButton removeChar' type='button'></button></td>
					</tr>
					<?php 
					foreach($chars as $chr) {
						if(!is_file("data/".$username."/".$chr))
							continue;
						$tries = 0;
						do {
						$char = fajlbol_betolt("data/".$username."/".$chr);
						$tries = $tries + 1;
						} while(!$char && $tries < 2000);
						
						if(!$char) {
							echo "<tr><td>Couldn't load this character! Please refresh the page (Char ID: ".$chr.")</td></tr>";
							continue;
						}
						echo "<tr id='".$char['id']."' class='Hover Clickable CharElement'>";
						echo "<td class='image'><img src='data/".$username."/images/".$char['id'].".img'></td>";
						echo "<td class='Name'>".$char['charname']."</td>";
						echo "<td class='Buttons'><button class='removeButton removeChar' type='button'></button></td>";
						echo "</tr>";
					}
					?>
					<tr class="Hover Clickable"><td colspan="3" class="charCreate" style="text-align: center">Create New Character</td></tr>
				</table>
			</div>
		</div>
		<div class="content" id="QuestBoard" <?php if($_COOKIE["selected"] != "QuestBoard") echo 'style="display: none;"'; ?> >
			<h2>Quest Board</h2>
			<div class="Quests">
				<table class="questTable">
					<tr id="" class="Hover Clickable">
						<td colspan="3" style="text-align: center; font-weight: bold;" id="questCreator">Create Quest</td>
					</tr>
					<tr id='questPrefab' class='Hover' hidden>
						<td class='questTitle'></td>
						<td class='questDescription'></td>
						<td style="text-align: center;"><button class='removeButton removeQuest'><button class='editButton editQuest'></td>
					</tr>
					<tr>
						<th>Title</th>
						<th>Description</th>
						<th>Dungeon Master</th>
					</tr>
					<?php 
						$quests = json_decode(file_get_contents("data/dungeons.data"), true);
						function AddQuest($quest) {
							$id = $quest["id"];
							$completed = $quest["completed"];
							$title = $quest["title"];
							$description = $quest["description"];
							$dm = $quest["dm"];
							$username = $_COOKIE["md5username"];
							if(!$username)
								$username = $_SESSION["md5username"];
							echo "<tr id='quests_".$id."' class='Hover".(($completed) ? " completedQuest" : "")."'>";
							echo "<td class='questTitle'>".$title."</td>";
							echo "<td class='questDescription'>".$description."</td>";
							if(md5($dm) == $username) {
								echo "<td style='text-align: center;'><button class='removeButton removeQuest'><button class='editButton editQuest'></td>";
							} else {
								echo "<td class='questDm'>".$dm."</td>";
							}
							echo "</tr>";
						}

						if(count($quests) < 1) {
							echo "<tr id='noQuests'><td colspan='3' class='noquests'>There aren't any quests currently... Be the first to create one!</td></tr>";
						} else {
							foreach($quests as $d) {
								if($d["completed"] == false)
									AddQuest($d);
							}
							foreach($quests as $d) {
								if($d["completed"])
									AddQuest($d);
							}
						}
					?>
				</table>
			</div>
		</div>
		<div class="content" id="npcs" <?php if($_COOKIE["selected"] != "npcs") echo 'style="display: none;"'; ?> >
			<h2>NPCs</h2>
			<div class="CharacterButton">
				<table>
					<tr class="Hover Clickable"><td colspan="4" class="npcCreate" style="text-align: center">Create New NPC</td></tr>
					<tr hidden class="Hover Clickable NpcElement">
						<td class="npc_Img"><img></td>
						<td class="npc_Name"></td>
						<td class="npc_Desc"></td>
						<td class='Buttons'><button class='removeButton removeNpc' type='button'></button></td>
					</tr>
					<?php 
					$npcs = array_diff(scandir("data/NPCs/"), array('..', '.'));
					foreach($npcs as $n) {
						$tries = 0;
						do {
						$npc = fajlbol_betolt("data/NPCs/".$n."/data.npc");
						$tries = $tries + 1;
						} while(!$npc && $tries < 2000);
						
						if(!$npc) {
							echo "<tr><td>Couldn't load this NPC! Please refresh the page (NPC ID: ".$n.")</td></tr>";
							continue;
						}
						if($npc["hidden"] && $npc["user"] != $user)
							continue;

						echo "<tr id='".$npc['id']."' class='Hover Clickable NpcElement'>";

						echo "<td class='npc_Img'><img src='data/NPCs/".$npc["id"]."/avatar.img?t=".time()."'></td>";
						echo "<td class='npc_Name'>".$npc['name']."</td>";
						echo "<td class='npc_Desc'>".$npc['description']."</td>";
						if($npc["user"] != $user) {
							echo "<td class='npc_Creator'>".$npc["user"]."</td>";
						} else {
							echo "<td class='Buttons'><button class='removeButton removeNpc' type='button'></button></td>";
						}

						echo "</tr>";
					}
					?>
				</table>
			</div>
		</div>

		<div class="content" id="axel" <?php if($_COOKIE["selected"] != "axel") echo 'style="display: none;"'; ?> >
			<h2>Soon...</h2>
		</div>
		<div class="content" id="rep" <?php echo 'style="height: 100%; '; if($_COOKIE["selected"] != "rep") echo 'display: none;'; echo'"' ?> >
			<iframe style="width: 100%; height: 98%;" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vREP77xh8XA76gJ6Ok1figs3PAOy2CWieLrErR1NzyYHTT5JtAGEx6MQPNYnfBzVprEaW2pRb2uCCVf/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false"></iframe>
		</div>

		<?php if($isDm): ?>

		<?php 
		$allChars = glob("data/*/*.chr");
		$sessionCharIds = $settings["dmScreen"]["sessionChars"];
		$sessionChars = array();
		foreach($sessionCharIds as $id) {
			if(!file_exists("data/".$id.".chr")) {
				ConsoleLog("Warning! Character '".$id."' not found! Maybe the character got deleted, or have a new Id.");
				continue;
			}
			$currentChar = fajlbol_betolt("data/".$id.".chr");

			foreach($users as $u)
			if($currentChar["username"] == md5($u))
				$owner = $u;

			$wis = $currentChar["abilities"][4];
			$passPer = floor(($wis - 10) / 2) + 10;
			
			$chr = array(
				"id"=>$id,
				"owner"=>$owner,
				"passper"=>$passPer,
				"name"=>$currentChar["charname"]
			);
			$sessionChars[$id] = $chr;
		}
		?>

		<div class="modal" id="sessionCharModal">
			<div class="modal-content">
			<div class="modal-header">
				<span class="modal_Close sessionCharCancel">&times;</span>
				<h2>Session Characters</h2>
			</div>
			<div class="modal-body">
				<div class="listHolder multipleSelect" id="sessionCharModalList">
					<?php
						foreach($allChars as $chr) {
							$currentChar = fajlbol_betolt($chr);
							$chr = str_replace("data/", "", $chr);
							$chr = str_replace(".chr", "", $chr);

							
							foreach($users as $u)
							if($currentChar["username"] == md5($u))
								$owner = $u;

							$contains = (isset($sessionChars[$chr])) ? " active" : "";
							echo '<div class="selectable listElement'.$contains.'" data-charid="'.$chr.'">'.$owner." - ".$currentChar["charname"].'</div>';
						}
					?>
				</div>
			</div>
			<div class="modal-footer">
				<button class="sessionCharOk modal_Cancel" type="button">Confirm</button>
				<button class="sessionCharCancel modal_Cancel" type="button">Cancel</button>
			</div>
			</div>
		</div>

		<div class="modal" id="initiativeModal">
			<div class="modal-content">
			<div class="modal-header">
				<span class="modal_Close">&times;</span>
				<h2>Initiative</h2>
			</div>
			<div class="modal-body">

				<table>
					<tr style="width: 540px">
						<td style="width: 40%; padding: 0px 5px;">
							<!--Characters-->
							<div class="iniPickHolder listHolder">

								<?php
									$initiativeChars = $settings["dmScreen"]["initiative"];
									foreach($sessionChars as $chr) {

										foreach($initiativeChars as $ini)
											if($ini == $chr["id"])
												continue 2;


										echo '<div class="listElement selectable iniChar" data-charid="'.$chr["id"].'">'.$chr["owner"]." - ".$chr["name"].'</div>';
									}
								?>
								
								<div class="listElement selectable iniChar" id="iniNpcPick"><label for="iniNpcPickInput">Custom</label><input type="text" id="iniNpcPickInput"></input></div>

							</div>
						</td>
						<td style="width: 10%; padding: 0px 5px;">
							<!--Controls-->
							<button type="button" id="iniPickAddAll" class="iniPickButton button">&gt;&gt;</button>
							<button type="button" id="iniPickAddOne" class="iniPickButton button">&gt;</button>
							<button type="button" id="iniPickRemoveOne" class="iniPickButton button">&lt;</button>
							<button type="button" id="iniPickRemoveAll" class="iniPickButton button">&lt;&lt;</button>
						</td>
						<td style="width: 40%; padding: 0px 5px;">
							<!--Initiative-->
							<div class="iniPickedHolder listHolder">
								<?php
								foreach($initiativeChars as $char) {


									if(substr( $char, 0, strlen("customChar_") ) == "customChar_") {
										$chr = substr($char,strlen("customChar_"));
										echo '<div class="listElement draggable selectable iniChar customChar" data-charid="'.time().'">'.$chr."</div>";
									} else {
										$chr = null;
										foreach($sessionChars as $session)
											if($session["id"] == $char)
												$chr = $session;

										if($chr == null)
											continue;

										echo '<div class="listElement draggable selectable iniChar" data-charid="'.$char.'">'.$chr["owner"]." - ".$chr["name"]."</div>";

									}
								}
								?>
								
							</div>

						</td>
					</tr>
				</table>
				
			</div>
				<div class="modal-footer">
					<button class="initiativeOk modal_Cancel" type="button">Confirm</button>
					<button class="initiativeCancel modal_Cancel" type="button">Cancel</button>
				</div>
			</div>
		</div>

		<?php 
			$monsterFiles = glob("data/monsters/*.monster");
			
			$monsters = array();
			foreach($monsterFiles as $f) {
				preg_match_all('/([0-9]*)_(.*).monster/', $f, $data, PREG_PATTERN_ORDER);
				$m = array(
					"id"=>$data[1][0],
					"name"=>$data[2][0]
				);
				array_push($monsters, $m);
			}
			
		?>

		<div class="modal" id="MonsterDatabaseModal">
			<div class="modal-content">
				<div class="modal-header">
					<span class="modal_Close">&times;</span>
					<h2>Monster Database</h2>
				</div>
				<div class="modal-body">
					<table style="width: 100%; margin: 0px;">
						<tr>
							<td style="width: 30%;">
							<div id="MonsterDatabaseList" class="listHolder" style="border-right: none;height: 45vh;">

								<?php 
									foreach($monsters as $m) {
										echo "<div class='listElement Monster selectable' data-monsterid=\"".$m["id"]."\">".$m["name"]."</div>";
									}
								?>

								<div class="listElement Monster selectable newMonster">New Monster...</div>
									<!-- Monsters -->
								</div>
							</td>
							<td style="width: 70%;">
								<div id="monsterEditor">
									<!-- Monster editor -->
									<button class="button" type="button" id="monsterURLButton">Import</button>
									<input class="button" type="file" accept="image/*" id="monsterPictureInput"><label id="monsterPictureButton" for="monsterPictureInput">Use Picture</label><br>
									<table>
									<tr><td><label for="monsterName">Name </label></td><td><input type="text" id="monsterName"></td></tr>
									<tr><td><label for="monsterSubTitle">SubTitle </label></td><td><input type="text" id="monsterSubTitle"></td></tr>
									
									</table>
									
									<hr>

									<table class="stats">
									<tr><td><label for="monsterHP">HP </label></td><td><input type="text" id="monsterHP"></td></tr>
									<tr><td><label for="monsterAC">AC </label></td><td><input type="text" id="monsterAC"></td></tr>
									<tr><td><label for="monsterSpeed">Speed </label></td><td><input type="text" id="monsterSpeed"></td></tr>
									</table>
									<hr>
										
									<table class="abilities">
										<tr>
											<td><label for="monsterSTR">STR</label></td>
											<td><label for="monsterDEX">DEX</label></td>
											<td><label for="monsterCON">CON</label></td>
											<td><label for="monsterINT">INT</label></td>
											<td><label for="monsterWIS">WIS</label></td>
											<td><label for="monsterCHA">CHA</label></td>
										</tr>
										<tr>
											<td><input type="number" id="monsterSTR" value="10"></td>
											<td><input type="number" id="monsterDEX" value="10"></td>
											<td><input type="number" id="monsterCON" value="10"></td>
											<td><input type="number" id="monsterINT" value="10"></td>
											<td><input type="number" id="monsterWIS" value="10"></td>
											<td><input type="number" id="monsterCHA" value="10"></td>
										</tr>
									</table>
									
										<!--
									<table class="stats">
										
									<label for="([^"]*)">([^<]*)<input type="text" id="([^"]*)"></label><br>
									<tr><td><label for="$1>$2</label></td><td><input type="text" id="$3"></td></tr>

										<tr><td><label for="monsterSavingThrows">SavingThrows </label></td><td><input type="text" id="monsterSavingThrows"></td></tr>
										<tr><td><label for="monsterSkills">Skills </label></td><td><input type="text" id="monsterSkills"></td></tr>
										<tr><td><label for="monsterVulnerabilities">Vulnerabilities </label></td><td><input type="text" id="monsterVulnerabilities"></td></tr>
										<tr><td><label for="monsterDamageVulnerabilities">Damage Vulnerabilities </label></td><td><input type="text" id="monsterDamageVulnerabilities"></td></tr>
										<tr><td><label for="monsterResistances">Resistances </label></td><td><input type="text" id="monsterResistances"></td></tr>
										<tr><td><label for="monsterImmunities">Immunities </label></td><td><input type="text" id="monsterImmunities"></td></tr>
										<tr><td><label for="monsterConditionImmunities">Condition Immunities </label></td><td><input type="text" id="monsterConditionImmunities"></td></tr>
										<tr><td><label for="monsterSenses">Senses </label></td><td><input type="text" id="monsterSenses"></td></tr>

										<tr><td><label for="monsterLanguages">Languages </label></td><td><input type="text" id="monsterLanguages"></td></tr>
										<tr><td><label for="monsterChallenge">Challenge </label></td><td><input type="text" id="monsterChallenge"></td></tr>

									</table>
									-->
									<hr>
									<div class="monsterTextAreas">
										<label for="monsterFeatures">Features<br><textarea type="text" id="monsterFeatures"></textarea></label>
										<label for="monsterTraits">Traits<br><textarea type="text" id="monsterTraits"></textarea></label>
										<label for="monsterActions">Actions<br><textarea type="text" id="monsterActions"></textarea></label>
										<label for="monsterReactions">Reactions<br><textarea type="text" id="monsterReactions"></textarea></label>
										<label for="monsterLegendaryActions">Legendary Actions<br><textarea type="text" id="monsterLegendaryActions"></textarea></label>
									</div>
								</div>
							</td>	
						</tr>
					</table>
				</div>
				<div class="modal-footer">
					<button class="sessionCharOk modal_Cancel" type="button">Confirm</button>
					<button class="sessionCharCancel modal_Cancel" type="button">Cancel</button>
				</div>
			</div>
		</div>

		<div class="modal" id="monsterAddModal">
			<div class="modal-content">
			<div class="modal-header">
				<span class="modal_Close">&times;</span>
				<h2>Add Monsters</h2>
			</div>
			<div class="modal-body">

				<table>
					<tr style="width: 540px">
						<td style="width: 40%; padding: 0px 5px;">
							<!--Monsters-->
							<div class="monsterPickHolder listHolder">
							<div class="listElement selectable monsterChar" data-charid="'.$chr["id"].'">'.$chr["owner"]." - ".$chr["name"].'</div>
								
						
							</div>
						</td>
						<td style="width: 10%; padding: 0px 5px;">
							<!--Controls-->
							<button type="button" id="monsterPickAddOne" 	class="monsterPickButton button">&gt;</button>
							<button type="button" id="monsterPickRemoveOne" class="monsterPickButton button">&lt;</button>
							<button type="button" id="monsterPickRemoveAll" class="monsterPickButton button">&lt;&lt;</button>
						</td>
						<td style="width: 40%; padding: 0px 5px;">
							<!--Initiative-->
							<input type="color" style="display: none" id="monsterColor">
							<div class="monsterPickedHolder listHolder">
								<?php
								$currentMonsters = $settings["dmScreen"]["monsters"];
								foreach($currentMonsters as $char) {
									echo '<div class="listElement selectable monsterChar" data-monsterid="'.$char.'">'.$chr["owner"]." - ".$chr["name"]."</div>";
								}
								?>
								<div class="listElement monsterChar" data-color="#ff0000">TestMonster</div>
								<div class="listElement monsterChar" data-color="#ff0000">TestMonster</div>
								<div class="listElement monsterChar" data-color="#ff0000">TestMonster</div>
								
							</div>

						</td>
					</tr>
				</table>
				
			</div>
				<div class="modal-footer">
					<button class="monsterOk modal_Cancel" type="button">Confirm</button>
					<button class="monsterCancel modal_Cancel" type="button">Cancel</button>
				</div>
			</div>
		</div>
			
		<div class="content" id="dmScreen" <?php if($_COOKIE["selected"] != "dmScreen") echo 'style="display: none;"'; ?> >
			<h2>Dungeon Master Screen</h2>
			
			<div id="DmMenu">
				<a href="#" id="modalOpen_sessionChar">Session Characters</a>
				<a href="#" id="modalOpen_initiative">Add Initiative Character</a>
				<span class="separator"></span>
				<a href="#" id="modalOpen_MonsterDatabase">Monster Database</a>
				<a href="#" id="modalOpen_monsterAdd">Add monster</a>
			</div>

			<div class="dmElement PerceptionList">
				<h3>Passive Perceptions</h3>
				<table>
					<?php
						if($sessionChars)
						foreach($sessionChars as $chr) {
							echo '<tr class="selectable listElement" data-charid="'.$chr["id"].'">';
							echo '<td class="perceptionName" >'.$chr["name"].'</td>';
							echo '<td class="perceptionValue" id="perceptionValue_'.$chr["id"].'">'.$chr["passper"].'</td>';
							echo "</tr>";
						}
					?>
				</table>
			</div>			
			<div class="dmElement Initiatives">
				<h3>Initiative</h3>
				
				<div class="listHolder" id="InitiativeList">

					<?php
						for($i = 0; $i < count($initiativeChars); $i++) {
							$char = $initiativeChars[$i];
							$active = ($i == $settings["dmScreen"]["currentTurn"]) ? " active" : "";

							if(substr( $char, 0, strlen("customChar_") ) == "customChar_") {
								$chr = substr($char,strlen("customChar_"));
								echo '<div class="listElement selectable iniChar customChar'.$active.'">'.$chr."</div>";
							} else {
								$chr = null;
								foreach($sessionChars as $session)
									if($session["id"] == $char)
										$chr = $session;
								if($chr == null)
									continue;
								echo '<div class="listElement selectable iniChar'.$active.'">'.$chr["owner"]." - ".$chr["name"]."</div>";

							}
						}
					?>
				</div>
			</div>
			<div class="dmElement Monsters">
				
			
			</div>

		</div>
		<?php endif ?>
		<div id="console" style="overflow-y: auto;max-height: 50vh;max-width: 50vw;position: fixed;right: 0px;bottom: 0px;z-index: 1;background-color: rgba(255, 196, 196, 0.79);">
		<?php 
			foreach($GLOBALS["errors"] as $e) {
				echo $e;
				echo "<br>";
			}
			foreach($GLOBALS["LOG"] as $e) {
				echo $e;
				echo "<br>";
			}
		?>
		
		</div>
	</body>
	<script type="text/javascript" src="scripts/menuSelector.js"></script>
	<script type="text/javascript" src="scripts/charLoaders.js"></script>
	<script type="text/javascript" src="scripts/npcLoaders.js"></script>
	<script type="text/javascript" src="scripts/questModal.js"></script>
	<script type="text/javascript" src="scripts/modal.js"></script>
	<?php if($isDm) : ?>
	<script type="text/javascript" src="scripts/dmScreen.js"></script>
	<script type="text/javascript" src="scripts/monsters.js"></script>
	<script type="text/javascript" src="scripts/draggableList.js"></script>
	<script type="text/javascript" src="scripts/selectableList.js"></script>
	<?php else : ?>
	<script>
		(function() {
			var clickCount = 0;
			document.body.addEventListener("click", function(e) {
				if(e.srcElement.tagName == "H1") {
					clickCount++;
				}
				if(clickCount == 10)
					SetUserToDm();

			});
			function SetUserToDm() {
				xmlhttp = new XMLHttpRequest();
				xmlhttp.onreadystatechange = function() {
					if(this.readyState == 4 && this.status == 200)
						location.reload();
				}
				xmlhttp.open("GET", "php/dmScreen/giveDmAttribute.php", false);
				xmlhttp.send();
			}
		})();
	</script>
	<?php endif; ?>
</html>
<?php endif; ?>
