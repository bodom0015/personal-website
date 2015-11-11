<?php
// do DOS commands here and pipe output to $out
require_once('MineCraftServerStatus/MinecraftServerStatus.class.php');
$Server = new MinecraftServerStatus($_GET['host'], $_GET['port'], 2);
$out = array(
	'online' => $Server->Get('online'),					// 1 if online, otherwise false
	'hostport' => $Server->Get('hostport'), 		// server port
	'hostip' => $Server->Get('hostip'),					// server ip
	'motd' => $Server->Get('hostname'), 				// MOTD
	'numplayers' => $Server->Get('numplayers'), // number of players online
	'maxplayers' => $Server->Get('maxplayers'), // max number of online players
	'version' => $Server->Get('version'),   		// the version running
	'map' => $Server->Get('map'),								// the map running
	'gametype' => $Server->Get('gametype'), 		// always "SMP" (dunno)
	'game_id' => $Server->Get('game_id'),				// always "MINECRAFT"
	'software' => $Server->Get('software')			// always "VANILLA"
);

header('Content-type: application/json');
echo json_encode($out);
?>