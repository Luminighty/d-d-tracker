<?php

	if(!$_GET["id"])
		return;

	$m = json_decode(file_get_contents(glob("data/monsters/".$_GET["id"]."_*.monster")[0]), true);
	//var_dump($m);
?>

<!doctype html>
<html>
    <head>
		<title>Monster</title>
		<style>
			body {
				font-family: Georgia, serif;
				font-size: 15px;
			}
			#holder {
				width: 550px;
				position: absolute;
				left: 50%;
				transform: translate(-50%);
      			background-image: url("http://imgsrv.roll20.net:5100/?src=raw.githubusercontent.com/Roll20/roll20-character-sheets/master/5th%20Edition%20OGL%20by%20Roll20/images/PHBBackground.png");
			
			}
			@media screen and (max-width: 550px) {
				#holder {
					width: 100%;
				}
			}
			.body {
      			padding: 0px 10px 0px 10px;
			}
			.gold {
				height: 6px;
				width: 101%;
				background-image: url(http://imgsrv.roll20.net:5100/?src=raw.githubusercontent.com/Roll20/roll20-character-sheets/master/5th%20Edition%20OGL%20by%20Roll20/images/Border.png);
				border: 1px solid #2f2112;
				border-radius: 2px;
				margin: 5px 0px 5px -3px;
			}
			.taper {
				
				border-bottom: solid 3px #a52a2a;
				margin: 10px -5px;
			}
			.name {
				
				font-family: Mrs Eaves;
				color: #58170D;
				font-size: 30px;
				font-weight: bolder;
				font-variant: small-caps;
				text-transform: capitalize;
				margin: -10px 0px -5px 0px;
     			line-height: 1.4em;
			}
			.subTitle {
				font-style: italic;
			}
			.listElement {
				color: #58170D;
     			line-height: 21px;
			}
			.list .listElement {
				color: black;
     			line-height: 21px;
			}
			.list .listElement b {
				font-style: italic;
			}
			.abilityHolder {
     			text-align: center;
				margin: 10px;
     			display: inline-block;
			}
			.abilityHolder span {
				margin: auto;
				font-weight: 700;
				line-height: 26px;
				text-align: center;
				font-size: 20px;
			}
			.ability {
				display: inline-block;
				line-height: 26px;
				text-align: center;
				font-size: 20px;
			}
			.abilities {
				color: #58170D;
			}
			h2 {
				font-family: sans-serif;
				font-variant: small-caps;
				font-size: 20px;
				text-transform: capitalize;
				color: #58170D;
				margin: 5px 0px -12px 0px;
				font-weight: normal;
				line-height: 1.4em;

			}
			.list hr {
				height: 1px;
				background-color: #a52a2a;
				border: none;
				margin: 10px 0px 5px 0px;
			}
		
		</style>
    </head>
    <body>
		<div id="holder">
				<div class="gold" style="position: relative; top: -10px"></div>
				<div class="body">
				<div class="titles">
					<h1 class="name"><?php echo $m["Name"]; ?></h1>
					<div class="subTitle"><?php echo $m["SubTitle"]; ?></div>
				</div>
				<div class="taper"></div>
				<div class="stats simplelist">
					<div class="listElement"><b>Armor Class: </b><?php echo $m["AC"]; ?></div>
					<div class="listElement"><b>Hit Points: </b><?php echo $m["HP"]; ?></div>
					<div class="listElement"><b>Speed: </b><?php echo $m["Speed"]; ?></div>
				</div>
				<div class="taper"></div>
				<div class="abilities">
					<div class="abilityHolder">
						<span>STR</span><br>
						<div class="ability"><?php $ab = $m["STR"]; echo $ab." (".(($ab >= 10) ? "+" : "").(floor(($ab - 10) / 2)).")" ?></div>
					</div>
					<div class="abilityHolder">
						<span>DEX</span><br>
						<div class="ability"><?php $ab = $m["DEX"]; echo $ab." (".(($ab >= 10) ? "+" : "").(floor(($ab - 10) / 2)).")" ?></div>
					</div>
					<div class="abilityHolder">
						<span>CON</span><br>
						<div class="ability"><?php $ab = $m["CON"]; echo $ab." (".(($ab >= 10) ? "+" : "").(floor(($ab - 10) / 2)).")" ?></div>
					</div>
					<div class="abilityHolder">
						<span>INT</span><br>
						<div class="ability"><?php $ab = $m["INT"]; echo $ab." (".(($ab >= 10) ? "+" : "").(floor(($ab - 10) / 2)).")" ?></div>
					</div>
					<div class="abilityHolder">
						<span>WIS</span><br>
						<div class="ability"><?php $ab = $m["WIS"]; echo $ab." (".(($ab >= 10) ? "+" : "").(floor(($ab - 10) / 2)).")" ?></div>
					</div>
					<div class="abilityHolder">
						<span>CHA</span><br>
						<div class="ability"><?php $ab = $m["CHA"]; echo $ab." (".(($ab >= 10) ? "+" : "").(floor(($ab - 10) / 2)).")" ?></div>
					</div>

				</div>
				<div class="taper"></div>
				<div class="features simpleList">
					<?php
					echo preg_replace("/(.{1,})\n/", '<div class="listElement">${0}</div>', $m["Features"]."\n"); ?>
				</div>
				<?php if($m["Traits"] != "") : ?>
				<div class="taper"></div>
				<div class="traits list">
					<?php
						echo preg_replace("/(.{1,})\n/", '<div class="listElement">${0}</div>', $m["Traits"]."\n");
					?>
				</div>
				<?php endif; ?>
				<?php if($m["Actions"] != "") : ?>
				<div class="actions list">
					<h2>Actions</h2>
					<hr>
					<div class="textHolder">
					<?php
						echo preg_replace("/(.{1,})\n/", '<div class="listElement">${0}</div>', $m["Actions"]."\n");
					?></div>
				</div>
				<?php endif; ?>
				<?php if($m["Reactions"] != "") : ?>
				<div class="reactions list">
					<h2>Reactions</h2>
					<hr>
					<div class="textHolder">
					<?php
						echo preg_replace("/(.{1,})\n/", '<div class="listElement">${0}</div>', $m["Reactions"]."\n");
					?></div>
				</div>
				<?php endif; ?>
				<?php if($m["LegendaryActions"] != "") : ?>
				<div class="legendary list">
					<h2>Legendary Actions</h2>
					<hr>
					<div class="textHolder">
					<?php
						echo preg_replace("/(.{1,})\n/", '<div class="listElement">${0}</div>', $m["LegendaryActions"]."\n");
					?></div>
				</div>
				<?php endif; ?>
			</div>
			<div class="gold" style="position: relative; top: 10px"></div>
		</div>
	</body>
</html>