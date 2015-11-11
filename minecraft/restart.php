<?php header( "Refresh:30;URL=http://bodom0015.game-server.cc/minecraft/" ); ?>
<html>
	<head>
		<title>Restarting Minecraft servers...</title>

		<meta name="charset" value="utf-8" />
		<meta name="robots" value="nofollow noindex" />
		<meta name="viewport" content="initial-scale=1.0, user-scalable=no">

		<link rel="stylesheet" type="text/css" href="/asset/css/bootstrap.min.css" />
		<link rel="stylesheet" type="text/css" href="/asset/css/suppl.css" />
		<link rel="stylesheet" type="text/css" href="/asset/css/font-awesome.min.css" />

		<link href="http://fonts.googleapis.com/css?family=Roboto:400,300" rel="stylesheet" type="text/css">
		<style type="text/css">body { font-family: "Roboto", sans-serif !important; }</style>

		<script type="text/javascript" src="/asset/js/jquery-1.11.1.min.js"></script>
		<script type="text/javascript" src="/asset/js/bootstrap.min.js"></script>
		<script>
				var pct = 100;
				var i = 30;
				var interval = null;
				
				setTimeout(function () {
					 window.location.href = 'http://bodom0015.game-server.cc/#/minecraft/'; // the redirect goes here
					 clearInterval(interval);
				}, 31000); // 30 seconds
				
				// Super hackey bullshit for the countdown...
				interval = setInterval(function () {
					pct -= 3.3;
					i--;
					$("#countdownBar").html(i + "s");
					$("#countdownBar").css("width", pct + "%");
					
					switch (i) {
						case 30:
						case 29:
							$("#statusBanner").html("Servers Shutting Down...");
							break;
						case 28:
						case 27:
							$("#statusBanner").html("Server Shut Down Complete!");
							break;
						case 26:
						case 25:
						case 24:
						case 23:
						case 22:
						case 21:
						case 20:
						case 19:
						case 18:
						case 17:
							$("#statusBanner").html("Restarting Servers...");
							break;
						case 16:
						case 15:
						case 14:
							$("#progressBar").html("65% Complete");
							$("#progressBar").css('width', '65%');
							break;
						case 13:	
						case 12:							
							$("#progressBar").html("78% Complete");
							$("#progressBar").css('width', '78%');
							break;
						case 11: 						
							$("#progressBar").html("95% Complete");
							$("#progressBar").css('width', '95%');
							break;
						case 10:
							$("#progressPanel").attr("class", "panel panel-warning");
							$("#statusBanner").html("Giving the mod servers a few extra seconds to start mods...");
							break;
						case 9:
							$("#progressPanel").attr("class", "panel panel-success");
							break;
						case 8:
							$("#progressPanel").attr("class", "panel panel-warning");
							$("#progressBar").html("96% Complete");
							$("#progressBar").css('width', '96%');
							break;
						case 7:
							$("#progressPanel").attr("class", "panel panel-success");
							break;
						case 6:
							$("#progressPanel").attr("class", "panel panel-warning");
							$("#progressBar").html("97% Complete");
							$("#progressBar").css('width', '97%');
							break;
						case 5:
							$("#progressPanel").attr("class", "panel panel-success");
							break;
						case 4:
							$("#progressPanel").attr("class", "panel panel-warning");
							$("#progressBar").html("98% Complete");
							$("#progressBar").css('width', '98%');
							break;
						case 3:
							$("#progressPanel").attr("class", "panel panel-success");
							break;
						case 2:
							$("#progressPanel").attr("class", "panel panel-warning");
							$("#progressBar").html("99% Complete");
							$("#progressBar").css('width', '99%');
							break;
						case 1:
							$("#progressPanel").attr("class", "panel panel-success");
							break;
						case 0:
							// Indicate success on status panel
							$("#progressPanel").attr("class", "panel panel-success");
							$("#progressBar").html("100% - Server Restart Complete!");
							$("#progressBar").css('width', '100%');
							$("#progressBar").attr('class', 'progress-bar progress-bar-success');
							
							// Indicate success on redirect countdown
							$("#countdownPanel").attr("class", "panel panel-success");
							$("#countdownBar").html("Redirecting...");
							$("#countdownBar").css("width", "100%");
							$("#countdownBar").toggleClass('progress-bar-warning progress-bar-success');
							
							// Stop the interval
							clearInterval(interval);
							interval = null;
							break;
						default:
							$("#progressBar").html("Dude, where's my progress?");
							break;
					}
				}, 1000); // 1 second
		</script>
	</head>
	<body class="container">
		<div class="jumbotron">
			<h1>Minecraft Server Restart</h1>
			
			<!--<p><a class="btn btn-primary btn-lg" role="button" onclick="minecraft_restart_all">Restart Servers</a></p>-->
		</div>
		
		<div class="row">
			<div class="col-sm-6">
				<div id="progressPanel" class="panel panel-primary">
					<div class="panel-heading">
						<h3 class="panel-title">Progress</h3>
					</div>
					<div class="panel-body">
						<p id="statusBanner">Servers are restarting. Please wait...</p>
						<div class="progress">
							<div id="progressBar" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="100" style="width: 1%">1% Complete</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-sm-6">
				<div id="countdownPanel" class="panel panel-warning">
					<div class="panel-heading">
						<h3 class="panel-title">Time Remaining</h3>
					</div>
					<div class="panel-body">
						<p>You will be redirected automatically once the restart is complete!</p>
						<div class="progress">
							<div id="countdownBar" class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="30" aria-valuemin="1" aria-valuemax="30" style="width: 100%">30s</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		
		
		<?php
			$port = isset($_GET['port']) ? (int) $_GET['port'] : null;
			function flush_buffers() {
					ob_flush();
					flush();
			}
			function update_progress($newPercentage) {		
					// Javascript for updating the progress bar and information
					echo '<script language="javascript">
					document.getElementById("progressBar").style.width="'.$newPercentage.'";
					document.getElementById("progressBar").innerText="'.$newPercentage.' Complete";';
					
					if ($newPercentage === "100%") {
						echo 'document.getElementById("progressBar").className="progress-bar";</script>';
					} else { 
						echo 'document.getElementById("progressBar").className="progress-bar progress-bar-striped active";</script>';
					}
					
					flush_buffers();
			}
			function runCommand($command, $message = "") {
					if ($message) {
						echo "<pre>> $message<br/></pre>";
					} else {
						echo "<pre>> $command<br/>";
					}
					
					flush_buffers();
					exec(escapeshellcmd($command));
					echo "</pre>";
					flush_buffers();
			}
			function minecraft_restart_all() {
					// allow 10 seconds time
					set_time_limit(30);
								
					update_progress("10%");
					sleep(1);
					update_progress("15%");
					sleep(1);
					// Kill the cmd.exe processes
					runCommand('cmd /c Call kill_all.bat', 'Shutting down servers...');
					update_progress("30%");
					sleep(2);
					update_progress("50%");
					sleep(2);
					update_progress("60%");
					runCommand('cmd /c Call start_all.bat', 'Starting servers...');
					flush_buffers();
					update_progress("100%");
					flush_buffers();
			}
			function minecraft_restart_single($serverPort) {
					// allow 10 seconds time
					set_time_limit(30);
								
					update_progress("10%");
					sleep(1);
					update_progress("15%");
					sleep(1);
					// Kill the cmd.exe processes
					//runCommand("start \"MineField\" cmd /C Call kill_${serverPort}.bat > NUL", "Shutting down server on ${serverPort}");
					runCommand('tasklist /A /V /S CIRCE /U CIRCE\Mike /FI "IMAGENAME eq cmd*"');
					runCommand('tasklist /A /V /S CIRCE /U CIRCE\Mike /FI "IMAGENAME eq java*"');
					//runCommand('tasklist /V /S CIRCE /U CIRCE\Mike /FI "WINDOWTITLE eq Minecraft*"');
					update_progress("30%");
					sleep(1);
					update_progress("50%");
					sleep(1);
					update_progress("60%");
					//runCommand("start \"MineCraft\" cmd /C Call start_${serverPort}.bat > NUL", "Starting server on ${serverPort}");
					update_progress("100%");
					flush_buffers();
			}
			if (isset($port) && $port !== null) {
				minecraft_restart_single($port);
			} else {
				minecraft_restart_all();
			}
		?>
		
		<h3 id="successBanner" >All servers successfully restarted!</h3>
		<a id="successButton" class="btn btn-success" href="/minecraft/">Back to Server Status</a>
	</body>
</html>