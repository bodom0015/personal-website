<section class="container">
  <div class="page-header">
    <h1>Ventrilo Server Status</h1>
  </div>
  
  <div class="alert alert-info">
    <p>
      Need a voice chat client? Why not <strong>Ventrilo?</strong> Download <a href="http://www.ventrilo.com/download.php">here</a>!
    </p>
  </div>
  
  <div class="alert alert-danger">
    <p>
      Learn more about how to use <strong>Ventrilo</strong> <a href="http://www.ventrilo.com/setup.php">here</a>! A list of FAQs is also available <a href="http://www.ventrilo.com/faq.php">here</a>!
    </p>
  </div>
  
  <div class="panel panel-primary">
    <div class="panel-heading">Ventrilo Server Status</div>
    <div class="panel-body">
      <!-- <p>Click <a href="http://www.ventrilo.com/status.php?hostname=bodom0015.game-server.cc&port=3784">here</a> to check the status of this Ventrilo server.</p> -->
<?php
define('BASE_PATH', 'D:/XAMPP/htdocs/ventrilo');
require_once(BASE_PATH."/ventrilostatus.php");

require_once(BASE_PATH."/ventriloinfo_ex1.php");
require_once(BASE_PATH."/ventrilodisplay_ex1.php");
require_once(BASE_PATH."/ventrilodisplay_ex2.php");
$stat = new CVentriloStatus;
$stat->m_cmdprog  = "ventrilo_status.exe";  // Adjust accordingly.
$stat->m_cmdcode  = "2";          // Detail mode.
$stat->m_cmdhost  = "127.0.0.1";      // Assume ventrilo server on same machine.
$stat->m_cmdport  = "3784";       // Port to be statused.
$stat->m_cmdpass  = "moneytrees";         // Status password if necessary.

$rc = $stat->Request();
if ( $rc )
{
  echo "CVentriloStatus->Request() failed. <strong>$stat->m_error</strong><br><br>\n";
}
      
echo "<center><table width=\"50%\" border=\"0\">\n";
VentriloInfoEX1( $stat );
echo "</table></center>\n";
?>
      <table class="table">
        <tr>
          <td width='30%'><strong>Hostname or IP</strong></td>
          <td width='70%'>{{ vent.hostname }}</td>
        </tr>
        <tr>
          <td><strong>Port number</strong></td> 
          <td>{{ vent.port }}</td> 
        </tr>
        <tr>
          <td width='30%'><strong>Password</strong></td>
          <td width='70%'><button type="button" class="btn btn-sm btn-info" data-toggle="popover" data-placement="top" title="Ventrilo Server Password" data-content="{{ vent.password }}">Show Password</button></td>
        </tr>
        <tr>
          <td width='30%'><strong>Current Users</strong></td>
          <td width='70%'>
<?php
echo "<br>\n";
echo "<center><table width=\"95%\" border=\"0\">\n";
VentriloDisplayEX1( $stat, "MoneyTreesHQ", 0, 0 );
echo "</table></center>\n"; 
?>
          </td>
        </tr>
      </table>
    </div>
  </div>
</section>